import LogIn from "@/components/LogIn";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type Props = {};
const LoginPage = async (props: Props) => {
    const session = await getAuthSession();

    if (session?.user) {
        // User is signed in
        return redirect("/dashboard-student");
    }
    return <LogIn />;
};
export default LoginPage;
