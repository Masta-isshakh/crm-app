import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";


const client = generateClient<Schema>();


export default function Dashboard() {
return (
<div>
<h2>Dashboard</h2>
<p>Overview of sales and support activity.</p>
</div>
);
}