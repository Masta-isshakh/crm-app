// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

/*
  Amplify Gen 2 – CRM Backend Schema
  Designed for a small company (≤20 users)
  Roles: ADMIN, SALES, SUPPORT
*/

const schema = a.schema({
  UserProfile: a
    .model({
      email: a.string().required(),
      fullName: a.string().required(),
      role: a.enum(["ADMIN", "SALES", "SUPPORT"]),
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.group("ADMIN"),
    ]),
Customer: a
  .model({
    name: a.string().required(),
    lastname: a.string().required(),      // si tu veux séparer le nom
    email: a.string(),
    phone: a.string(),
    company: a.string(),
    notes: a.string(),
    createdBy: a.string(),
    createdAt: a.datetime(),

    contacts: a.hasMany("Contact", "customerId"),
    deals: a.hasMany("Deal", "customerId"),
    tickets: a.hasMany("Ticket", "customerId"),
  })
  .authorization((allow) => [
    allow.owner(),                   // Le créateur peut lire/écrire
    allow.group("ADMIN"),            // Les admins peuvent tout faire
    allow.group("SALES"),            // Les commerciaux peuvent tout faire
    allow.group("SUPPORT").to(["read"]), // Support peut juste lire
  ]),


Employee: a
  .model({
    firstName: a.string().required(),
    lastName: a.string().required(),
    position: a.string(),
    email: a.string().required(),
    phone: a.string(),
    salary: a.integer(),
    createdAt: a.datetime(),
  })
  .authorization((allow) => [
    allow.group("ADMIN"), // full CRUD
  ]),





  Contact: a
    .model({
      customerId: a.id().required(),
      fullName: a.string().required(),
      email: a.string(),
      phone: a.string(),
      position: a.string(),
      createdAt: a.datetime(),

      customer: a.belongsTo("Customer", "customerId"),
    })
    .authorization((allow) => [
      allow.group("ADMIN"),
      allow.group("SALES"),
    ]),

  Deal: a
    .model({
      customerId: a.id().required(),
      title: a.string().required(),
      value: a.float(),
      stage: a.enum([
        "LEAD",
        "QUALIFIED",
        "PROPOSAL",
        "NEGOTIATION",
        "WON",
        "LOST",
      ]),
      expectedCloseDate: a.date(),
      owner: a.string(),
      createdAt: a.datetime(),

      customer: a.belongsTo("Customer", "customerId"),
    })
    .authorization((allow) => [
      allow.group("ADMIN"),
      allow.group("SALES"),
    ]),

  Ticket: a
    .model({
      customerId: a.id().required(),
      title: a.string().required(),
      description: a.string(),
      status: a.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
      priority: a.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
      assignedTo: a.string(),
      createdAt: a.datetime(),

      customer: a.belongsTo("Customer", "customerId"),
      comments: a.hasMany("TicketComment", "ticketId"),
    })
    .authorization((allow) => [
      allow.group("ADMIN"),
      allow.group("SUPPORT"),
      allow.group("SALES").to(["read"]),
    ]),

  TicketComment: a
    .model({
      ticketId: a.id().required(),
      message: a.string().required(),
      author: a.string(),
      createdAt: a.datetime(),

      ticket: a.belongsTo("Ticket", "ticketId"),
    })
    .authorization((allow) => [
      allow.group("ADMIN"),
      allow.group("SUPPORT"),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
