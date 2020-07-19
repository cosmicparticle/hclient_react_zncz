import React from 'react'
import { HashRouter, Route , Switch, Redirect} from 'react-router-dom'
import App from './App'
import Admin from './pages/admin'
import Loginit from './pages/login'
import Home from './pages/home'
import HisRoute from './pages/fmhome/historicalRoute'
import PeopleTrace from './pages/fmhome/peopleTrace'


import ActTable from "./pages/actTable"
import Detail from "./pages/detail"
import Import from "./pages/importData/importData"
import ActTree from "./pages/actTree"
import CustomPageRouter from "./pages/customPage/CustomPageRouter";

export default class iRouter extends React.Component{

    render(){

        return (
            <HashRouter>
                <App>                  
                    <Switch>                  
                        <Route path="/login"  component={Loginit}/>
                        <Route path='/' render={()=>
                            <Admin>
                                <Switch>
                                    <Route path='/home' component={Home} exact/>
                                    <Route path='/customPage/:menuId/fm/2' component={PeopleTrace} exact/>
                                    <Route path='/customPage/:menuId/fm/3' component={HisRoute} exact/>
                                    <Route path='/customPage/:menuId/:pageName(.+)' component={CustomPageRouter}/>
                                    <Route path="/:menuId" component={ActTable} exact />
                                    <Route path="/relation/:menuId/:ratmplId/:rootCode" component={ActTable} exact />
                                    <Route path="/:menuId/search" component={ActTable} exact />
                                    <Route path="/:menuId/import" component={Import} exact />
                                    <Route path="/:menuId/ActTree" component={ActTree} exact />
                                    <Route path="/:menuId/:type/relation/:ratmplId/:rootCode" component={Detail} exact />
                                    <Route path="/:menuId/:type" component={Detail} exact />
                                    <Route path="/:menuId/:type/:code" component={Detail} exact/>
                                    <Route path="/relation/:menuId/:ratmplId/:rootCode/:type/:code" component={Detail} exact/>
                                    <Route path="/:menuId/:type/:code/:nodeId" component={Detail} exact />
                                    <Redirect to="/home"/>
                                </Switch>
                                
                            </Admin>
                        }/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}