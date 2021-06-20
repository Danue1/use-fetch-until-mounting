# useFetchUntilMounting

## Example

```tsx
import { useFetchUntilMounting } from "use-fetch-until-mounting";
import { Suspense } from "react";

const App = () => {
  const fetch = useFetchUntilMounting([]);
  const [user, setUser] = useState(null);

  const fetchUser = () => fetch(async () => {
    const user = await loadUser();
    return () => {
      setUser(user)
    }
  })

  return (
    <div>
      <button onClick={fetchUser}>FETCH!</button>
      {user === null && <div>unknown</div>}
      {user !== null && <div>{user.displayName}</div>}
    </div>
  )
};
```

## Installation

```cmd
# npm
npm i use-fetch-until-mounting

# yarn
yarn add use-fetch-until-mounting
```
