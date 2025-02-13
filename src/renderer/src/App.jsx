import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await window.api.getFamilyMembers();
      setFamilyMembers(res);
    })();
  }, []);


  console.log(familyMembers)

  return (
    <>
      <div className="page-heading">
        <img className="page-logo" src={logo} alt="" />
        <h1>Члены Семьи</h1>
      </div>
      <div className="family-members-list">
        {familyMembers.map((member) => (
          <div
            key={member.member_id}
            className="family-member-card"
            onClick={() => navigate("/update", { state: { member } })}
          >
            <div className="member-info">
              <p>
                <strong>ФИО:</strong> {member.full_name}
              </p>
              <p>
                <strong>Возраст:</strong> {member.age}
              </p>
              <p>
                <strong>Должность:</strong> {member.current_position}
              </p>
              <p>
                <strong>Место работы:</strong> {member.workplace}
              </p>
              <p>
                <strong>Общий доход:</strong> {parseFloat(member.total_income)}
              </p>
            </div>
            <div className="budget-status">
              <p>
                <strong>Состояние трат к доходам:</strong>{" "}
                {member.budget_status}
              </p>
            </div>
          </div>
        ))}
        <Link to={"/create"}>
          <button>Создать члена семьи</button>
        </Link>
      </div>
    </>
  );
}

export default App;
