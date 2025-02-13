import { Link } from "react-router-dom";

export default function CreateFamilyMember() {
  async function submitHandler(e) {
    e.preventDefault();
    const newMember = {
      full_name: e.target.full_name.value,
      birth_date: e.target.birth_date.value,
      current_position: e.target.current_position.value,
      workplace: e.target.workplace.value,
      total_income: parseFloat(e.target.total_income.value),
    };

    await window.api.createFamilyMember(newMember);
    document.querySelector("form").reset();
  }

  return (
    <div className="form">
      <Link to={"/"}>
        <button>{"<-- Назад"}</button>
      </Link>
      <h1>Создать члена семьи</h1>
      <form onSubmit={(e) => submitHandler(e)}>
        <label htmlFor="full_name">ФИО:</label>
        <input id="full_name" type="text" required />

        <label htmlFor="birth_date">Дата рождения:</label>
        <input id="birth_date" type="date" required />

        <label htmlFor="current_position">Текущая должность:</label>
        <input id="current_position" type="text" />

        <label htmlFor="workplace">Текущее место работы:</label>
        <input id="workplace" type="text" />

        <label htmlFor="total_income">Текущий месячный доход:</label>
        <input id="total_income" type="number" min="0" required />

        <button type="submit">Создать члена семьи</button>
      </form>
    </div>
  );
}
