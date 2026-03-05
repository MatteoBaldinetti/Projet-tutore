import Layout from "../components/Layout";
import MaterielList from "../pages/student/MaterielList.tsx";

function Test() {
    return (
        <div>
            <Layout
                titleHeader="Catalogue de matériel"
                children={
                    <MaterielList />
                }
            />
        </div>
    );
}

export default Test;