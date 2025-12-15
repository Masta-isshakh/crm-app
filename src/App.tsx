// src/App.tsx
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import MainLayout from "./components/MainLayout";


export default function App() {
return (
<Authenticator>
{({ signOut, user }) => (
<MainLayout user={user} signOut={signOut || (() => {})} />
)}
</Authenticator>
);
}