# Flow Charts — MVP #1

The key user flows, drawn from the use cases in `use-cases.md`. GitHub renders the
Mermaid diagrams below. All data is synthetic this phase.

## 1. Anonymous contribution (Resident)

```mermaid
flowchart TD
  A([Resident opens the Community record]) --> B[Write a note; pick an optional topic]
  B --> C{Note valid and consent ticked?}
  C -- No --> B
  C -- Yes --> D[Send anonymously]
  D --> E[(Stored in Supabase: anonymous, synthetic only)]
  E --> F([Shown back in the community record])
```

A contribution never carries identity, and the consent step must be ticked before it can be sent.

## 2. The warrant: issue and revoke (Community body)

```mermaid
flowchart TD
  A([Community member signs in]) --> B[Join the community body]
  B --> C{Quorum met?}
  C -- No --> D[/Issue blocked: need more members/]
  C -- Yes --> E[Member issues a warrant with a reason]
  E --> F[(Warrant active; receipt logged)]
  F --> G([Provider standing: UNDER WARRANT])
  G --> H{A member revokes it?}
  H -- No --> G
  H -- Yes --> I[(Warrant revoked; receipt logged)]
  I --> J([Provider standing: no active warrant])
```

Issuing and revoking are explicit community actions by body members, gated on quorum, and every action logs an audit receipt.

## 3. Sign-up / login

```mermaid
flowchart TD
  A([Open Log in]) --> B{Have an account?}
  B -- No --> C[Sign up: email, password, role]
  C --> D[(Profile row created; signed in)]
  B -- Yes --> E[Log in: email and password]
  E --> F{Valid credentials?}
  F -- No --> E
  F -- Yes --> D
  D --> G([Nav shows the user; role features unlock])
```

Accounts exist only for roles that must be identified (community members, providers); contributing stays anonymous and needs no account.
