import { useParams } from "react-router-dom"

export function TaskDetailsPage () {
    const { taskId } = useParams();
    return (

        <>
            <h1>Task Details</h1>
            <p>Task Id: {taskId}</p>
        </>
    );
}