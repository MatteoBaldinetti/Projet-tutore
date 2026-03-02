import Layout from "../components/Layout";
import ManageStudents from "../pages/admin/ManageStudents.tsx";

function Test() {
    return (
        <div>
            <Layout
                children={
                    <ManageStudents />
                }
            />
        </div>
    );
}

export default Test;