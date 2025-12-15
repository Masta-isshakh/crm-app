import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";


const client = generateClient<Schema>();


export default function Customers() {
const [customers, setCustomers] = useState<any[]>([]);


useEffect(() => {
client.models.Customer.list().then(({ data }) => {
setCustomers(data);
});
}, []);


return (
<div>
<h2>Customers</h2>
<ul>
{customers.map((c) => (
<li key={c.id}>{c.name}</li>
))}
</ul>
</div>
);
}