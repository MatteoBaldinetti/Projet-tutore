import Layout from "../components/Layout";
import ManageSubjects from "./admin/ManageSubjects.tsx";

function Test() {
    return (
        <div>
            <Layout
                children={
                    <ManageSubjects />
                }
            />
        </div>
    );
}

export default Test;