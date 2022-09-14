// import { store } from "./src/Redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistor from "./redux/store";
import store from "./redux/store";
import Routing from "./routing";
import "antd/dist/antd.css";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <Routing />
      {/* </PersistGate> */}
    </Provider>
  );
}

export default App;
