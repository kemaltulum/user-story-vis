(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{24:function(e,t,n){e.exports=n(50)},29:function(e,t,n){},30:function(e,t,n){},31:function(e,t,n){},32:function(e,t,n){},33:function(e,t,n){},34:function(e,t,n){},35:function(e,t,n){},44:function(e,t,n){},45:function(e,t,n){},46:function(e,t,n){},47:function(e,t,n){},48:function(e,t,n){},49:function(e,t,n){},50:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(19),i=n.n(o),l=(n(29),n(5)),c=n(6),s=n(8),d=n(7),m=n(9),u=n(11),f=n(10),p=(n(30),n(31),r.a.createContext({token:null,userId:null,login:function(e,t,n){},logout:function(){}})),h=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(s.a)(this,Object(d.a)(t).call(this,e))).state={isLogin:!0},n.switchModeHandler=function(){n.setState(function(e){return{isLogin:!e.isLogin}})},n.submitHandler=function(e){e.preventDefault();var t=n.emailEl.current.value,a=n.passwordEl.current.value;if(0!==t.trim().length&&0!==a.trim().length){var r={query:"\n        query Login($email: String!, $password: String!) {\n          login(email: $email, password: $password) {\n            userId\n            token\n            tokenExpiration\n          }\n        }\n      ",variables:{email:t,password:a}};n.state.isLogin||(r={query:"\n          mutation CreateUser($email: String!, $password: String!) {\n            createUser(userInput: {email: $email, password: $password}) {\n              _id\n              email\n            }\n          }\n        ",variables:{email:t,password:a}}),fetch("http://localhost:8000/graphql",{method:"POST",body:JSON.stringify(r),headers:{"Content-Type":"application/json"}}).then(function(e){if(200!==e.status&&201!==e.status)throw new Error("Failed!");return e.json()}).then(function(e){e.data.login.token&&n.context.login(e.data.login.token,e.data.login.userId,e.data.login.tokenExpiration)}).catch(function(e){console.log(e)})}},n.emailEl=r.a.createRef(),n.passwordEl=r.a.createRef(),n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("form",{className:"auth-form",onSubmit:this.submitHandler},r.a.createElement("div",{className:"form-control"},r.a.createElement("label",{htmlFor:"email"},"E-Mail"),r.a.createElement("input",{type:"email",id:"email",ref:this.emailEl})),r.a.createElement("div",{className:"form-control"},r.a.createElement("label",{htmlFor:"password"},"Password"),r.a.createElement("input",{type:"password",id:"password",ref:this.passwordEl})),r.a.createElement("div",{className:"form-actions"},r.a.createElement("button",{type:"submit"},this.state.isLogin?"Login":"Sign Up"),r.a.createElement("button",{type:"button",onClick:this.switchModeHandler},"Switch to ",this.state.isLogin?"Sign Up":"Login")))}}]),t}(a.Component);h.contextType=p;var E=h,g=n(22),y=(n(32),function(e){return r.a.createElement("div",{className:"modal"},r.a.createElement("header",{className:"modal__header"},r.a.createElement("h1",null,e.title)),r.a.createElement("section",{className:"modal__content"},e.children),r.a.createElement("section",{className:"modal__actions"},e.canCancel&&r.a.createElement("button",{className:"btn",onClick:e.onCancel},"Cancel"),e.canConfirm&&r.a.createElement("button",{className:"btn",onClick:e.onConfirm},e.confirmText)))}),v=(n(33),function(e){return r.a.createElement("div",{className:"backdrop"})}),j=(n(34),function(){return r.a.createElement("div",{className:"spinner"},r.a.createElement("div",{className:"lds-dual-ring"}))}),b=(n(35),function(e){return r.a.createElement("li",{key:e.projectId,className:"projects__list-item"},r.a.createElement("div",null,r.a.createElement("h1",null,e.name)),r.a.createElement("div",null,r.a.createElement(u.b,{className:"btn",to:e.projectId+"/stories"},"Stories")))}),S=(n(44),function(e){var t=e.projects.map(function(t){return r.a.createElement(b,{key:t._id,projectId:t._id,name:t.name,description:t.description,onAddStory:e.onAddStory})});return r.a.createElement("ul",{className:"projects__list"},t)}),_=(n(45),function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(s.a)(this,Object(d.a)(t).call(this,e))).state={creating:!1,projects:[],isLoading:!1},n.isActive=!0,n.startCreateEventHandler=function(){n.setState({creating:!0})},n.modalConfirmHandler=function(){n.setState({creating:!1});var e=n.nameElRef.current.value,t=n.descriptionElRef.current.value;if(0!==e.trim().length&&0!==t.trim().length){var a={query:"\n          mutation CreateProject($name: String!, $desc: String!) {\n            createProject(name: $name, description: $desc) {\n              _id\n              name\n              description\n            }\n          }\n        ",variables:{name:e,desc:t}},r=n.context.token;fetch("http://localhost:8000/graphql",{method:"POST",body:JSON.stringify(a),headers:{"Content-Type":"application/json",Authorization:"Bearer "+r}}).then(function(e){if(200!==e.status&&201!==e.status)throw new Error("Failed!");return e.json()}).then(function(e){n.setState(function(t){var a=Object(g.a)(t.projects);return a.push({_id:e.data.createProject._id,name:e.data.createProject.name,description:e.data.createProject.description,creator:{_id:n.context.userId}}),{projects:a}})}).catch(function(e){console.log(e)})}},n.modalCancelHandler=function(){n.setState({creating:!1})},n.nameElRef=r.a.createRef(),n.descriptionElRef=r.a.createRef(),n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.fetchProjects()}},{key:"fetchProjects",value:function(){var e=this;this.setState({isLoading:!0});fetch("http://localhost:8000/graphql",{method:"POST",body:JSON.stringify({query:"\n          query {\n            projects {\n              _id\n              name\n              description\n              creator {\n                _id\n                email\n              }\n            }\n          }\n        "}),headers:{"Content-Type":"application/json"}}).then(function(e){if(200!==e.status&&201!==e.status)throw new Error("Failed!");return e.json()}).then(function(t){var n=t.data.projects;e.isActive&&e.setState({projects:n,isLoading:!1})}).catch(function(t){console.log(t),e.isActive&&e.setState({isLoading:!1})})}},{key:"addStoryHandler",value:function(e){console.log(e,"add story")}},{key:"componentWillUnmount",value:function(){this.isActive=!1}},{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,(this.state.creating||this.state.selectedEvent)&&r.a.createElement(v,null),this.state.creating&&r.a.createElement(y,{title:"Add Project",canCancel:!0,canConfirm:!0,onCancel:this.modalCancelHandler,onConfirm:this.modalConfirmHandler,confirmText:"Confirm"},r.a.createElement("form",null,r.a.createElement("div",{className:"form-control"},r.a.createElement("label",{htmlFor:"name"},"Name"),r.a.createElement("input",{type:"text",id:"name",ref:this.nameElRef})),r.a.createElement("div",{className:"form-control"},r.a.createElement("label",{htmlFor:"description"},"Description"),r.a.createElement("textarea",{id:"description",rows:"4",ref:this.descriptionElRef})))),this.context.token&&r.a.createElement("div",{className:"events-control"},r.a.createElement("p",null,"Add your project!"),r.a.createElement("button",{className:"btn",onClick:this.startCreateEventHandler},"Create Project")),this.state.isLoading?r.a.createElement(j,null):r.a.createElement(S,{projects:this.state.projects,onAddStory:this.addStoryHandler}))}}]),t}(a.Component));_.contextType=p;var w=_,C=n(23),k=(n(46),function(e){return r.a.createElement("li",{key:e.projectId,className:"projects__list-item"},r.a.createElement("div",null,r.a.createElement("p",null,e.fullText)),r.a.createElement("div",null,r.a.createElement("p",null,r.a.createElement("strong",null,"Actor:")," ",e.actor),r.a.createElement("p",null,r.a.createElement("strong",null,"Action:")," ",e.action),r.a.createElement("p",null,r.a.createElement("strong",null,"Benefit:")," ",e.benefit)))}),x=(n(47),function(e){var t=e.stories.map(function(e){return r.a.createElement(k,{key:e._id,storyId:e._id,fullText:e.full_text,actor:e.actor,action:e.action,benefit:e.benefit,isParsed:e.is_parsed})});return r.a.createElement("ul",{className:"storys__list"},t)}),O=(n(48),function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(s.a)(this,Object(d.a)(t).call(this,e))).state={modelOpened:!1,modalType:"single",stories:[],isLoading:!1},n.startAddStoryHandlerSingle=function(){n.setState({modalOpened:!0,modalType:"single"})},n.startAddStoryHandlerRaw=function(){n.setState({modalOpened:!0,modalType:"raw"})},n.modalCancelHandler=function(){n.setState({modalOpened:!1})},n.modalConfirmHandler=function(){var e;if("single"===n.state.modalType)e={query:"\n                    mutation addStory($full_text: String!, $id_user: String!, $project_id: String!) {\n                        addStory(storyInput : {full_text: $full_text, id_user: $id_user, project_id: $project_id}) {\n                        _id\n                        full_text\n                        actor\n                        action\n                        benefit\n                        is_parsed\n                        }\n                    }\n                    ",variables:{full_text:n.storyElRef.current.value,id_user:n.idUserElRef.current.value,project_id:n.props.match.params.project_id}};else if("raw"===n.state.modalType){var t=n.rawTextElRef.current.value;console.log(t),e={query:"\n                    mutation addStories($rawText: String!, $project_id: String!) {\n                        addStoryBulkRaw(rawText: $rawText, projectId: $project_id) {\n                        _id\n                        full_text\n                        actor\n                        action\n                        benefit\n                        is_parsed\n                        }\n                    }\n                    ",variables:{rawText:t,project_id:n.props.match.params.project_id}}}var a=n.context.token;fetch("http://localhost:8000/graphql",{method:"POST",body:JSON.stringify(e),headers:{"Content-Type":"application/json",Authorization:"Bearer "+a}}).then(function(e){if(200!==e.status&&201!==e.status)throw new Error("Failed!");return e.json()}).then(function(e){n.setState(function(t){var n=t.stories;return n.push(Object(C.a)({},e.data.addStory)),{stories:n,modalOpened:!1}})}).catch(function(e){console.log(e),n.setState({modalOpened:!1})})},n.storyElRef=r.a.createRef(),n.idUserElRef=r.a.createRef(),n.rawTextElRef=r.a.createRef(),n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"fetchStories",value:function(){var e=this;this.setState({isLoading:!0});var t={query:"\n                    query getStories($project_id: String!) {\n                        stories(projectId: $project_id) {\n                        _id\n                        full_text\n                        actor\n                        action\n                        benefit\n                        is_parsed\n                        }\n                    }\n                    ",variables:{project_id:this.props.match.params.project_id}},n=this.context.token;fetch("http://localhost:8000/graphql",{method:"POST",body:JSON.stringify(t),headers:{"Content-Type":"application/json",Authorization:"Bearer "+n}}).then(function(e){if(200!==e.status&&201!==e.status)throw new Error("Failed!");return e.json()}).then(function(t){var n=t.data.stories;e.setState({stories:n,isLoading:!1})}).catch(function(t){console.log(t),e.setState({isLoading:!1})})}},{key:"componentDidMount",value:function(){console.log(this.props.match),this.fetchStories()}},{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,this.state.modalOpened&&"single"===this.state.modalType&&r.a.createElement(v,null),this.state.modalOpened&&r.a.createElement(y,{title:"Add Story",canCancel:!0,canConfirm:!0,onCancel:this.modalCancelHandler,onConfirm:this.modalConfirmHandler,confirmText:"Add"},r.a.createElement("form",null,r.a.createElement("div",{className:"form-control"},r.a.createElement("label",{htmlFor:"story"},"User Story"),r.a.createElement("input",{type:"text",id:"story",ref:this.storyElRef})),r.a.createElement("div",{className:"form-control"},r.a.createElement("label",{htmlFor:"id_user"},"Story ID"),r.a.createElement("input",{type:"text",id:"id_user",ref:this.idUserElRef})))),this.state.modalOpened&&"raw"===this.state.modalType&&r.a.createElement(v,null),this.state.modalOpened&&r.a.createElement(y,{title:"Add Story Raw Text",canCancel:!0,canConfirm:!0,onCancel:this.modalCancelHandler,onConfirm:this.modalConfirmHandler,confirmText:"Add"},r.a.createElement("form",null,r.a.createElement("div",{className:"form-control"},r.a.createElement("label",{htmlFor:"story"},"User Story"),r.a.createElement("textarea",{type:"text",id:"story",rows:"10",ref:this.rawTextElRef})))),this.context.token&&r.a.createElement("div",{className:"stories-control"},r.a.createElement("p",null,"Add stories to your project!"),r.a.createElement("button",{className:"btn",onClick:this.startAddStoryHandlerSingle},"Add Story"),r.a.createElement("button",{className:"btn",onClick:this.startAddStoryHandlerRaw},"Add Story Raw")),this.state.isLoading?r.a.createElement(j,null):r.a.createElement(x,{stories:this.state.stories}))}}]),t}(a.Component));O.contextType=p;var N=O,T=(n(49),function(e){return r.a.createElement(p.Consumer,null,function(e){return r.a.createElement("header",{className:"main-navigation"},r.a.createElement("div",{className:"main-navigation__logo"},r.a.createElement("h1",null,"AgileStory")),r.a.createElement("nav",{className:"main-navigation__items"},r.a.createElement("ul",null,e.token&&r.a.createElement(r.a.Fragment,null,r.a.createElement("li",null,r.a.createElement(u.c,{to:"/projects"},"Projects")),r.a.createElement("li",null,r.a.createElement("button",{onClick:e.logout},"Logout"))))))})}),A=function(e){function t(){var e,n;Object(l.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(s.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(r)))).state={token:null,userId:null},n.login=function(e,t,a){n.setState({token:e,userId:t})},n.logout=function(){n.setState({token:null,userId:null})},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement(u.a,null,r.a.createElement(r.a.Fragment,null,r.a.createElement(p.Provider,{value:{token:this.state.token,userId:this.state.userId,login:this.login,logout:this.logout}},r.a.createElement(T,null),r.a.createElement("main",{className:"main-content"},r.a.createElement(f.d,null,this.state.token&&r.a.createElement(f.a,{from:"/",to:"/projects",exact:!0}),this.state.token&&r.a.createElement(f.a,{from:"/auth",to:"/projects",exact:!0}),!this.state.token&&r.a.createElement(f.b,{path:"/auth",component:E}),this.state.token&&r.a.createElement(f.b,{path:"/:project_id/stories",component:N}),this.state.token&&r.a.createElement(f.b,{path:"/projects",component:w}),!this.state.token&&r.a.createElement(f.a,{to:"/auth",exact:!0}))))))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(A,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[24,1,2]]]);
//# sourceMappingURL=main.617d604b.chunk.js.map