// import { store } from "./src/Redux/store";
import { Provider } from "react-redux";
import store from "./redux/store";
import Routing from "./routing";
import "antd/dist/antd.css";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Routing />
    </Provider>
  );
}

export default App;
