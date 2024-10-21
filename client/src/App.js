import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import SnackbarProvider from "react-simple-snackbar";
import Home from "./components/Home/Home";
import Invoice from "./components/Invoice/Invoice";
import Invoices from "./components/Invoices/Invoices";
import InvoiceDetails from "./components/InvoiceDetails/InvoiceDetails";
import ClientList from "./components/Clients/ClientList";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings/Settings";
import Forgot from "./components/Password/Forgot";
import Reset from "./components/Password/Reset";
import Layout from "./components/Layout"; // Import your layout
 
function App() {
  //eslint-disable-next-line
  const user = JSON.parse(localStorage.getItem("profile"));

  return (
    <div>
      <BrowserRouter>
        <SnackbarProvider>
          <Switch>
            {/* Use Layout for routes that need it */}
            <Route path="/">
              <Layout>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/login" exact component={Login} />
                  <Route path="/invoice" exact component={Invoice} />
                  <Route path="/edit/invoice/:id" exact component={Invoice} />
                  <Route path="/invoice/:id" exact component={InvoiceDetails} />
                  <Route path="/invoices" exact component={Invoices} />
                  <Route path="/settings" exact component={Settings} />
                  <Route path="/dashboard" exact component={Dashboard} />
                  <Route path="/customers" exact component={ClientList} />
                  <Route path="/forgot" exact component={Forgot} />
                  <Route path="/reset/:token" exact component={Reset} />
                  <Redirect from="/new-invoice" to="/invoice" />
                </Switch>
              </Layout>
            </Route>

            {/* Routes outside Layout */}
            <Route path="/login" exact component={Login} />
          </Switch>
        </SnackbarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
