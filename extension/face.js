const addLoggedOutUI=()=>{
    let composeWrapper=document.querySelector("div#composeWrapper")

    if(!composeWrapper){
        const subjectInput=$("input[placeholder='Subject']")
        const parentForm = subjectInput[0].closest('form');

        composeWrapper=createElem('div',null,'composeWrapper',parentForm)
        let composeParent=createElem('div','loggedOut','composeParent',composeWrapper)

        const tbody=$('div[aria-label="Message Body"]')
        tbody[0].style.paddingTop='95px'

        let h1=createElem('p','h10',null,composeParent)
        h1.innerText='You are logged out'
        let p1=createElem('p','p10',null,composeParent)
        p1.innerText='Sign in with your email to proceed'

        let btnDiv=createElem('div','btnDiv',null,composeParent)
        let cancelBtn=createElem('button','cancelBtn',null,btnDiv)
        cancelBtn.innerText='Cancel'
        cancelBtn.addEventListener('click',e=>{
            tbody[0].style.paddingTop='0px'
            composeWrapper.style.display='none'
        })
        let signLink=createElem('a','signLink',null,btnDiv)
        signLink.setAttribute('href','https://mail.google.com/')
        signLink.setAttribute('target','_blank')
        let signBtn=createElem('button','signBtn',null,signLink)
        signBtn.innerText='Sign In'



    }
}

const addButtons=()=>{

    let composeWrapper=document.querySelector("div#composeWrapper")

    if(!composeWrapper){
        const subjectInput=$("input[placeholder='Subject']")
        const parentForm = subjectInput[0].closest('form');

        composeWrapper=createElem('div',null,'composeWrapper',parentForm)
        let composeParent=createElem('div',null,'composeParent',composeWrapper)

        //Error div
        makeErrorDiv(composeWrapper)



        const tbody=$('div[aria-label="Message Body"]')
        tbody[0].style.paddingTop='105px'


        const main_div=createElem('div','main_div',null,composeParent)
        const prompt_div=createElem('div','prompt_div',null,main_div)

        //Remove btn
        const rmvBtn=createElem('span','rmvBtn','rmvBtn',composeWrapper)
        rmvBtn.innerHTML='&#10005'
        rmvBtn.addEventListener('click',e=>{
            // composeParent.style.height='10px'
            toggleUIDisplay()
        })

        //Loading Overlay
        const loading_overlay=createElem('div','loading_overlay',null,main_div)
        let dotsA=['one','two','three']
        dotsA.forEach(item=>{
            let dot=createElem('h1','dots',item,loading_overlay)
            dot.innerText='.'
        })

        //actual prompt
        const prompt_input=createElem('span','prompt_input',null,prompt_div)
        prompt_input.setAttribute('contenteditable',true)
        prompt_input.addEventListener('click',e=>{
            keepAdding=false
        })

        prompt_input.addEventListener('focus',e=>{
            prompt_div.style.boxShadow='2px 2px 10px 2px purple'
        })
        prompt_input.addEventListener('blur',e=>{
            prompt_div.style.boxShadow='none'
            prompt_div.scrollTo(0, 0);
        })

        prompt_div.addEventListener('click',e=>{
            document.querySelector('.prompt_input').focus()
        })

        //label
        // let label=createElem('label','label',null,prompt_div)
        // label.setAttribute('trans','prefix')
        // label.innerText='Write an email'
        let labelText='Write an email to '.split(' ')
        let writeTime=0
        prompt_input.focus()
        let firstWriteInt=setInterval(()=>{
            if(writeTime<labelText.length){
                prompt_input.textContent +=labelText[writeTime]+' '
                writeTime+=1

            }else{
                prompt_input.dispatchEvent(
                    new Event("focus", {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                    })
                );
                clearInterval(firstWriteInt)
            }
        },300)


        //Controls
        let ctrl_div=createElem('div','ctrl_div',null,main_div)
        let btn_box=createElem('div','btn_box',null,ctrl_div)

        //Buttons
        //generate
        const gen_btn=createElem('button',null,'gen_btn',btn_box)
        gen_btn.innerText='Write'
        gen_btn.setAttribute('trans','writeBtn')
        gen_btn.addEventListener('click',e=>{
            e.preventDefault()
            addOverlay()
            const prompt_input=document.querySelector('span.prompt_input')
            let prompt=prompt_input.innerText
            // onSub=false
            // writtenSub=false
            handleQuery(prompt,prompt_input)
        })
        //stop
        const stop_gen=createElem('span',null,'stop_gen',btn_box)
        stop_gen.addEventListener('click',e=>{
            chrome.runtime.sendMessage({stopGen:true})
        })
        
        stop_gen.setAttribute('title','stop generating')
        stop_gen.setAttribute('trans','stopBtn')
        // rd_btn.innerHTML='&#9632;'
        
        // btn_box.appendChild(gen_btn)
        // btn_box.appendChild(stop_gen)

        //options
        let option_box=createElem('div','option_box',null,ctrl_div)
        //language
        let lang_select=createElem('select','options','lang_select',option_box)
        //Language
        // let lang=createElem('div','options','lang_options',option_box)
        // let lang_tt=createElem('div','option_title',"lang_tt",lang)
        // lang_tt.innerHTML='<small>Lang</small>'

        for(const prop in lan_obj){
            let opt=createElem('option',"lang_options",null,lang_select)
            opt.setAttribute('value',prop)
            if(prop==Language){
                opt.setAttribute('selected',true)
            }
            opt.innerHTML=`<p>${lan_obj[prop]}</p>`
        }
        lang_select.addEventListener('change',e=>{
            Language=e.target.value
            chrome.runtime.sendMessage({setLang:Language})
            // changeLanguage()
        })
        //Settings
        let settings=createElem('div','options','settings',option_box)
        settings.addEventListener('click',e=>{
            document.querySelector('.settings_div').style.display='block'
        })

        let settings_tt=createElem('div',"option_title","settings_tt",settings)
        settings_tt.innerHTML='<small>&#9881</small>'

        // let settings_div=createElem('div',null,"settings_div",settings)
        // settings_div.innerHTML='<small>Settings</small>'

        makeSettingsDiv(option_box)
        // changeLanguage()
        // addDefaultPrompts()

    }

    

    return
}

let lastState

const toggleUIDisplay=(close,open)=>{
    const tbody=$('div[aria-label="Message Body"]')
    let composeParent=$('div#composeParent')
    const rmvBtn=$('span#rmvBtn')

    let currPadding=tbody[0].style.paddingTop
    open=open || currPadding=='0px' 
    close=close || !(currPadding=='0px') 

    console.log('open:',open);
    console.log('close:',close);

    if(open){
        tbody[0].style.paddingTop='105px'
        composeParent[0].style.display='block'
        rmvBtn[0].innerHTML='&#10005;'
    }
    if(close){
        tbody[0].style.paddingTop='0px'
        composeParent[0].style.display='none'
        rmvBtn[0].innerHTML='&#x25BC;'
    }
    
    
}

const makeErrorDiv=(parentElement)=>{
    let errorDivParent=createElem('div',null,'errorDivParent',parentElement)
    let errorDiv=createElem('div',null,'errorDiv',errorDivParent)
    let errorHead=createElem('div',null,'errorHead',errorDiv)
    let errorTitle=createElem('span',null,'errorTitle',errorHead)
    // errorTitle.innerText='Network error'
    let errorX=createElem('span',null,'errorX',errorHead)
    errorX.innerHTML='&#x2715;'
    errorX.addEventListener('click',e=>{
        document.querySelector('#errorDivParent').style.display='none'
    })
    let errorExplain=createElem('div',null,'errorExplain',errorDiv)
    let errorExP=createElem('p',null,'errorExP',errorExplain)
    // errorExP.innerText='Please check your network settings and try again'
}

const makeSettingsDiv=(parentElement)=>{
    let settings_div=createElem('div',"settings_div",null,parentElement)
    let settings_top=createElem('div',"settings_top",null,settings_div)
    let setP=createElem('p',null,'setP',settings_top)
    setP.innerText='Settings'
    setP.setAttribute('trans','settingsTitle')
    let setClose=createElem('p',null,'setClose',settings_top)
    setClose.innerHTML='&#10005'
    setClose.addEventListener('click',e=>{
        document.querySelector('.settings_div').style.display='none'
    })

    let settings_tabs=createElem('div',"settings_tabs",null,settings_div)

    let tabsArr=['Profile','Saved','Account']

    tabsArr.forEach((item,index)=>{
        let tab=createElem('span',"tabs",item,settings_tabs)
        tab.innerText=item
        tab.setAttribute('trans','settings')
        if(index==0){
            tab.classList.add('active')
        }
        tab.addEventListener('click',e=>{
            e.target.parentNode.childNodes.forEach(tab=>{
                tab.classList.remove('active')
            })
            e.target.classList.add('active')

            document.querySelectorAll('div.tabContent').forEach(cnt=>{
                
                cnt.classList.remove('active')
                if(cnt.getAttribute('id')==e.target.id){
                    cnt.classList.add('active')
                }
            })
        })
    })

    let allContent=createElem('div',"allContent",null,settings_div)

    tabsArr.forEach(async(item,index)=>{
        let tabC=createElem('div',"tabContent",item,allContent)
        // tabC.innerText=item
        if(index==0){
            tabC.classList.add('active')
        }
        if(item=='Profile'){
            let wrapper=createElem('div',null,null,tabC)
            wrapper.style.display='flex'
            let email=await getEmail()
            let profpicDiv=createElem('div',null,'profpicDiv',wrapper)
            profpicDiv.textContent=email[0].toUpperCase()
            let profInfo=createElem('div',null,'profInfo',wrapper)
            let emailName=createElem('span',null,'emailName',profInfo)
            emailName.textContent=email
            let profileExp=createElem('span',null,'profileExp',tabC)
            profileExp.textContent='Set your profile name/title and GhostMail will sign generated emails with your identity'

            let profileData=createElem('div',null,'profileData',tabC)
            let inputDiv1=createElem('div',null,'inputDiv',profileData)
            let nameCheckbox=createElem('input',null,'nameCheckbox',inputDiv1)
            nameCheckbox.setAttribute('type','checkbox')
            let nameLabel=createElem('label',null,'nameLabel',inputDiv1)
            nameLabel.innerHTML='Name:'
            let nameInput=createElem('input',null,'nameInput',inputDiv1)

            let inputDiv2=createElem('div',null,'inputDiv',profileData)
            let titleCheckbox=createElem('input',null,'titleCheckbox',inputDiv2)
            titleCheckbox.setAttribute('type','checkbox')
            let titleLabel=createElem('label',null,'titleLabel',inputDiv2)
            titleLabel.innerHTML='Title:'
            let titleInput=createElem('input',null,'titleInput',inputDiv2)

            let inputDiv3=createElem('div',null,'inputDiv',profileData)
            let saveBtn=createElem('button',null,'saveBtn',inputDiv3)
            saveBtn.innerText='Save'

            saveBtn.addEventListener("click",e=>{
                e.preventDefault()
                let newName=nameInput.value
                let newTitle=titleInput.value

                let useName=nameCheckbox.checked
                let useTitle=titleCheckbox.checked

                chrome.runtime.sendMessage({message:true,newName,newTitle,useName,useTitle})
            })

            nameCheckbox.addEventListener("change",e=>{
                if(e.target.checked){
                    titleCheckbox.checked=false
                }
            })

            titleCheckbox.addEventListener("change",e=>{
                if(e.target.checked){
                    nameCheckbox.checked=false
                }
            })


        }
        else if(item=='Saved'){
            tabC.innerText='Your saved emails'
        }
        else if(item=='Account'){
            tabC.innerText='Your Account details'
        }
    })
}

const getEmail=()=>{
    return new Promise((resolve,reject)=>{
        const myPort=chrome.runtime.connect({name:'Gd exchange'})
        myPort.onMessage.addListener(function(msg) {
            if(msg.userEmail){
                resolve(msg.userEmail)
            }
        })
        myPort.postMessage({getEmail:true});

    })
}
