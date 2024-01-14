import Logout from "@/components/Logout";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type Props = {};
const LogoutPage = async (props: Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        // User is signed in
        return redirect("/");
    }
    return <Logout />;
};
export default LogoutPage;
