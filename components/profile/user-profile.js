// import { useState, useEffect } from "react";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";
// import { getSession } from "next-auth/client";

// using useSession has a downside, the loading doesn't get updated as session does not get changed at first as we are logged out, the loading stays true and do not get updated.
// Another work-around is that, we can use getSession which sends the request & gets the latest session data and then we can react to the resonse for that request. And thats's how we can make our own loading state.

function UserProfile() {
  // Redirect away if NOT auth
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   getSession().then((session) => {
  //     // session object will be null if user is not logged in or it will be an object of session data.

  //     if (session) {
  //       setIsLoading(false);
  //     } else {
  //       window.location.href = "/auth";
  // This is fine for initial page load where we haven't done any progress in the application, using it in between will resets the whole application.
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  // }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
