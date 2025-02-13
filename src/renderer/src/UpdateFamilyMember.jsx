import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function UpdateFamilyMember() {
  const location = useLocation();
  const [familyMember, setFamilyMember] = useState(location.state.member);

  async function submitHandler(e) {
    e.preventDefault();
    const updatedMember = {
      member_id: familyMember.member_id,
      full_name: e.target.full_name.value,
      birth_date: e.target.birth_date.value, 
      current_position: e.target.current_position.value,
      workplace: e.target.workplace.value,
      total_income: parseFloat(e.target.total_income.value),
    };

    await window.api.updateFamilyMember(updatedMember);
    setFamilyMember(updatedMember);
    document.querySelector("form").reset();
  }

  return (
    <div className="form">
      <Link to={"/"}>
        <button>{"<-- Назад"}</button>
      </Link>
      <h1>Обновить данные члена семьи</h1>
      <form onSubmit={(e) => submitHandler(e)}>
        <label htmlFor="full_name">ФИО:</label>
        <input
          id="full_name"
          type="text"
          required
          defaultValue={familyMember.full_name}
        />

        <label htmlFor="birth_date">Дата рождения:</label>
        <input
          id="birth_date"
          type="date"
          required
          defaultValue={new Date(familyMember.birth_date).toISOString().split('T')[0] }
        />

        <label htmlFor="current_position">Текущая должность:</label>
        <input
          id="current_position"
          type="text"
          defaultValue={familyMember.current_position}
        />

        <label htmlFor="workplace">Текущее место работы:</label>
        <input
          id="workplace"
          type="text"
          defaultValue={familyMember.workplace}
        />

        <label htmlFor="total_income">Текущий месячный доход:</label>
        <input
          id="total_income"
          type="number"
          min="0"
          required
          defaultValue={parseFloat(familyMember.total_income)}
        />

        <button type="submit">Обновить данные</button>
      </form>
    </div>
  );
}
