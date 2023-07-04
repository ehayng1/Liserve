import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
// import SideBar from "../Component/SideBar";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* <SideBar></SideBar> */}
        <Link
          // href="#"
          // style={{ marigin: "auto auto", width: "20%" }}
          variant="body2"
          onClick={() => {
            navigate("/signup");
          }}
        >
          {"Don't have an account? Sign Up"}
        </Link>

        <Link
          // href="#"
          // style={{ marigin: "auto auto", width: "20%" }}
          variant="body2"
          onClick={() => {
            navigate("/signin");
          }}
        >
          {"Sign In"}
        </Link>
      </div>
    </>
  );
}
