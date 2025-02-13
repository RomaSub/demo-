import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

import connectDB from "./db";

async function getFamilyMembers() {
  try {
    const response = await global.dbclient.query(`WITH LastMonth AS (
    SELECT
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AS start_date,
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day' AS end_date
),
LastMonthIncome AS (
    SELECT
        j.member_id,
        SUM(j.salary) AS total_income
    FROM
        Jobs j
    JOIN
        LastMonth lm ON j.start_date <= lm.end_date
    WHERE
        j.start_date <= lm.end_date
    GROUP BY
        j.member_id
),
LastMonthExpenses AS (
    SELECT
        e.member_id,
        SUM(p.unit_price * e.quantity) AS total_expenses
    FROM
        Expenses e
    JOIN
        Products p ON e.product_id = p.product_id
    JOIN
        LastMonth lm ON e.purchase_date BETWEEN lm.start_date AND lm.end_date
    GROUP BY
        e.member_id
)
SELECT
    fm.member_id,
    fm.full_name,
    fm.birth_date,
    EXTRACT(YEAR FROM AGE(fm.birth_date)) AS age,
    COALESCE(j.position, 'Безработный') AS current_position,
    COALESCE(j.organization, '-') AS workplace,
    COALESCE(li.total_income, 0) AS total_income,
    COALESCE(le.total_expenses, 0) AS total_expenses,
    CASE
        WHEN COALESCE(li.total_income, 0) > COALESCE(le.total_expenses, 0) THEN 'Профицит бюджета'
        ELSE 'Дефицит бюджета'
    END AS budget_status
FROM
    FamilyMembers fm
LEFT JOIN
    Jobs j ON fm.member_id = j.member_id
LEFT JOIN
    LastMonthIncome li ON fm.member_id = li.member_id
LEFT JOIN
    LastMonthExpenses le ON fm.member_id = le.member_id;`);
    console.log(response.rows);
    return response.rows;
  } catch (e) {
    console.log(e);
  }
}

async function createFamilyMember(newMember) {
  const { full_name, birth_date, current_position, workplace, total_income } =
    newMember;

  try {
    // доделать
    dialog.showMessageBox({ message: "Успех! Член семьи создан" });
  } catch (e) {
    consol.log(e);

    if (e.code === "23505") {
      dialog.showErrorBox("Ошибка", "Член семьи с таким именем уже существует");
    } else {
      dialog.showErrorBox(
        "Ошибка",
        "Не удалось создать члена семьи: " + e.message,
      );
    }
  }
}

async function updateFamilyMember(updatedMember) {
  const { id, full_name, birth_date } = member;

  try {
    await global.dbclient.query(`UPDATE family_members
      SET full_name = '${full_name}'
      WHERE id = ${id};`);
    dialog.showMessageBox({ message: "Успех! Данные обновлены" });
    return;
  } catch (e) {
    consol.log(e);

    if (e.code === "23505") {
      dialog.showErrorBox("Ошибка", "Член семьи с таким именем уже существует");
    } else {
      dialog.showErrorBox("Ошибка", "Не удалось обновить данные: " + e.message);
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    icon: join(__dirname, "../../resources/icon.ico"),
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.openDevTools();
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.electron");

  global.dbclient = await connectDB();
  ipcMain.handle("getFamilyMembers", getFamilyMembers);
  ipcMain.handle("createFamilyMember", createFamilyMember);
  ipcMain.handle("updateFamilyMember", updateFamilyMember);

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
