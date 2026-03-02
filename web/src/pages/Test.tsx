import Layout from "../components/Layout";
import ManageSubject from "../pages/admin/ManageSubject.tsx";

function Test() {
    return (
        <div>
            <Layout
                children={
                    <ManageSubject />
                }
            />
        </div>
    );
}

export default Test;