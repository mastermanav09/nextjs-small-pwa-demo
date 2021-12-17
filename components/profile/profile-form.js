import classes from "./profile-form.module.css";
import { useRef, useState } from "react";

function ProfileForm() {
  const oldPassRef = useRef();
  const newPassRef = useRef();
  const [error, setError] = useState(null);

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setError(null);

    const oldPassword = oldPassRef.current.value;
    const newPassword = newPassRef.current.value;

    if (!newPassword || newPassword.trim().length < 8) {
      setError("Please enter password of at least 8 characters.");
      return;
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(data);
    } catch (error) {
      setError(error.message);
    }

    oldPassRef.current.value = "";
    newPassRef.current.value = "";
  };

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPassRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPassRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
      {error && (
        <p style={{ fontSize: "20px", color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}
    </form>
  );
}

export default ProfileForm;
