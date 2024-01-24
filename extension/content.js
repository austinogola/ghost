
chrome.runtime.onMessage.addListener(async(request,sender,sendResponse)=>{
    if(request.setLang){
        if(request.setLang=='false'){
            var language;
            if (window.navigator.languages) {
                language = window.navigator.languages[0];
            } else {
                language = window.navigator.userLanguage || window.navigator.language;
            }
            Language=language
            chrome.runtime.sendMessage({setLang:language})
        }
        else{
            Language=request.setLang
        }

        // changeLanguage()
        
    }
})

let Language

chrome.runtime.sendMessage({getLang:true})


// if (document.URL.indexOf("https://mail.google.com/") == 0) {
//   // We're in Gmail!
//   // Add your code here to do something when someone is in Gmail.
//   chrome.runtime.sendMessage({message: "user_is_in_gmail"});

// }

let composePresent=false
let replyPresent=false

const changeLanguage=async()=>{
    console.log(`/languages/_locales/${Language}/messages.json`);
    let mans=chrome.runtime.getURL(`languages/_locales/${Language}/messages.json`)
    let langJson=await fetch(mans)

    if(langJson.status==200){
        let actualJson=await langJson.json()
        // console.log(actualJson);
        let composeParent=document.querySelector("div#composeParent")

        Object.keys(actualJson).forEach(key=>{
            // console.log(key);
            if(key!='settings'){
                let relevantElement=composeParent.querySelector(`[trans=${key}]`)
                if(relevantElement){
                    if(key=='stopBtn'){
                        relevantElement.setAttribute('title',actualJson[key])
                    }else{
                        relevantElement.innerText=actualJson[key]
                    }
                }else{
                    console.log('Not found');
                }
            }
        })
    }
    else{
        quickPrompt(`Could not translate to ${Language}`)
    }

    let indentInterval=setInterval(()=>{
        let composeParent=document.querySelector("div#compose_parent")
        if(composeParent.querySelector('.label').offsetWidth>0){
            composeParent.querySelector('.prompt_input').style.textIndent=`${composeParent.querySelector('.label').offsetWidth+3}px`
            console.log('Indented is',composeParent.querySelector('.label').offsetWidth+5);
            clearInterval(indentInterval)
        }
    },50)

    
}



const createElem=(type,clas,id,target)=>{
    let el=document.createElement(type)

    if(clas){
        el.setAttribute('class',clas)
    }
    if(id){
        el.setAttribute('id',id)
    }
    if(target){
        target.appendChild(el)
    }

    return el
}

const lan_obj={
            ar:'Arabic - العربية' , bn:"Bengali - বাংলা" , zh:'Chinese - 中文', "zh-CN":"Chinese (Simplified) - 中文（简体)" , 
            "zh-TW":"Chinese (Traditional) - 中文（繁體)", hr:"Croatian - hrvatski" , cs:"Czech - čeština", da:"Danish - dansk" , nl:"Dutch - Nederlands", 
            en:"English", "en-GB":"English (UK)", "en-US":"English (US)",fr:"French - français" , de:"German" , hi:"Hindi",
            is:"Icelandic - íslenska",id:"Indonesian - Indonesia", ga:"Irish - Gaeilge",it:"Italian - italiano",ja:"Japanese - 日本語" , ko:"Korean - 한국어" , 
            no:"Norwegian - norsk" , pl:"Polish - polski" ,sv:'Swedish',pt:"Portuguese - português","pt-BR":"Portuguese (Brazil)" , ru:"Russian - русский",
            es:"Spanish - español",vi:"Vietnamese - Tiếng Việt"

        }


const addOverlay=()=>{
    let loading_overlay=document.querySelector('.loading_overlay')
    if(loading_overlay){
        // loading_overlay.style.backgroundColor='rgba(255,255,255,0.7)'
        loading_overlay.style.display='flex'
        loading_overlay.addEventListener('click',e=>{
            e.target.style.display='none'
        })
    }
}

let stopWrite=false

const addDefaultPrompts=()=>{
    chrome.runtime.sendMessage({getPrompts: true},response=>{
        let arr=response.def_prompts
        // addTexts(arr)
    })
}

let keepAdding=true
const addTexts=async(arr)=>{
    const prompt_span=document.querySelector("span#prompt_input")
    let doneIndx=[]
    return new Promise(async(resolve,reject)=>{
        prompt_span.focus()
        while(doneIndx.length<=arr.length && keepAdding){
            let indx=Math.floor(Math.random()*arr.length)
            while(doneIndx.includes(indx)){
                indx=Math.floor(Math.random()*arr.length)
            }
            doneIndx.push(indx)
            // chrome.runtime.sendMessage({message:`Runnig index ${indx}`})
            let text=arr[indx]
    
            while(prompt_span.innerText.length>0 && keepAdding){
                curr=prompt_span.innerText
                prompt_span.innerText=curr.slice(0,curr.length-1)
                await sleep(25)
            }
            await sleep (500)
    
            let m=0
            while(m<text.length && keepAdding){
                prompt_span.innerText+=text[m]
                if(text[m]==' '){
                    prompt_span.innerText+='\u00a0' 
                }
                prompt_span.focus()
                keepAdding=true
                m+=1
                await sleep(30)
            }
            await sleep (1500)
    
    
        }
        prompt_span.focus()
        keepAdding=true
        resolve('DONE')
    })
    

}

const sleep=(ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


const addTexts2=(arr)=>{
    const prompt_span=document.querySelector("span#prompt_span")
    let text=arr[Math.floor(Math.random()*arr.length)]
    let text_arr=text.split(' ')
    

    function typeWriter(text) {
        let i=0
        prompt_span.dispatchEvent(new Event('input'));
        if (i < text.length) {
            prompt_span.innerText+=text.charAt(i)
            i++;
            setTimeout(typeWriter, 30);
        }
    }

    for(let m=0;m<text_arr.length;m++){
        typeWriter(text_arr[m])
        prompt_span.innerText+=' '
    }

    // return new Promise((resolve,reject)=>{
    //     
    //     prompt_span.innerText=arr[0]
    //     // while(!stopWrite){
    //     //     let text=arr[Math.floor(Math.random()*arr.length)]
    //     //     let speed=100 //ms
    //     //     let i=0

    //     //     function typeWriter() {
    //     //         if (i < text.length) {
    //     //             prompt_span.innerText+=text.charAt(i)
    //     //           i++;
    //     //           setTimeout(typeWriter, speed);
    //     //         }
    //     //       }
    //     // }
    // })
}

const checkComposeBoxer=()=>{
    const subjectInput=document.querySelector("input[placeholder='Subject']")
    if(subjectInput){
       if(!composePresent){
            composePresent=true
            chrome.storage.local.get('ghostMailState')
            .then(res=>{
                if(res.ghostMailState && 
                    (res.ghostMailState=='missing email' || res.ghostMailState=='expired')){
                        //LOggedOutUI
                        console.log(res.ghostMailState);
                        addLoggedOutUI()

                }else{
                    addButtons()
                }
            })
            
            // chrome.runtime.sendMessage({message: "user has opened the message box"});
       }
    }
    else{
        let composeWrapper=document.querySelector("div#composeWrapper")
        if(composeWrapper){
            composeWrapper.parentNode.removeChild(composeWrapper);
        }
        composePresent=false
    }
}

const checkReplyBox=()=>{
    const snBtn=document.querySelector('div[jslog][data-tooltip]')

    if(snBtn){
        console.log(snBtn);
        let tVal=snBtn.getAttribute('data-tooltip')
        if(tVal.includes("Send")){
            //reply is present
            if(!replyPresent){
                replyPresent=true
                chrome.runtime.sendMessage({message: "user has opened the reply box"});
            }
        }
        else{
            replyPresent=false
        }
    }
    else{
        replyPresent=false
    }
}


var observer = new MutationObserver((mutations)=> {
    mutations.forEach(mutation=>{
        if(mutation.addedNodes.length!==0 && mutation.type === "childList"){
            checkComposeBoxer()
            // checkReplyBox()
            // mutation.addedNodes.forEach(node=>{
            //     if(node.id){
            //         console.log('Has ID',node.id);
            //         console.log(node);
            //         // if(node.getAttribute("placeholder")){
            //         //     console.log('Has placeholder too');
            //         // }
            //     }
            //     // if(node.getAtrribute('role')=='dialog'){
            //     //     console.log(mutation);
            //     // }
            // })
        }
    })
    // mutations.forEach(function(mutation) {
    //   if (mutation.addedNodes.length && mutation.addedNodes[0].getAttribute("role") == "dialog" && mutation.addedNodes[0].querySelector('[name="to"]')) {
    //     // The compose box was added to the DOM!
    //     // Send a message to the background script.
    //     chrome.runtime.sendMessage({message: "user_opened_compose_box"});
    //   }
    // });
  });

// Start observing the document for changes.
observer.observe(document, { childList: true, subtree: true });

const checkVerification=(port)=>{
    return new Promise((resolve,reject)=>{
        port.postMessage({verify:true})
        port.onMessage.addListener(msg=>{
            if(msg.error || msg.success){
                resolve(msg)
            }
            
        })
    })
}

const checkUsage=(port)=>{
    return new Promise((resolve,reject)=>{
        port.postMessage({checkUsage:true})
        port.onMessage.addListener(msg=>{
            // console.log(msg);
            if(msg.allowed && msg.allowed==true){
                resolve({proceed:true})
            }
            else if(msg.reason){
                resolve({stop:true,reason:msg.reason})
            }
        })
    })
}

let subjectDelivered=false
let finishedSubject=false

const geneRated=[]

const displayGen=(message)=>{
    const subJectBox=$('input[name="subjectbox"]')[0]
    const msgBox=$('div[aria-label="Message Body"]')[0]
    const loading_overlay=$('div.loading_overlay')[0]

    loading_overlay.style.display='none'

    // geneRated.push(message)



    // if(message==='DONEKABISAAA'){
    //     subjectDelivered=false
    // }
    msgBox.innerText+=message
    return
    if(message.toLowerCase().includes("subject") && !onSubject){
        onSubject=true
        // console.log(onSubject);
        message=message.slice(8)
        // console.log(meso);
    }

    if(onSubject){
        if(message.includes('\n')){
            // message=message.trim()
            onSubject=false

        }
        subJectBox.value+=message
    }else{
        msgBox.innerText+=message
    }
   
    // if(!subjectDelivered){
        
    // }
    

    // if(onSubject){
    //     let meso=message
    //     if(message.includes('\n')){
    //         onSubject=false
    //         let msgArray=message.split('\n')
    //         meso=msgArray[0]
    //         msgBox.innerText+=msgArray[1]
    //     }
    //     
    //     let subjectText=subJectBox.value.toLowerCase()
    //     if(subjectText.includes('subject')){
    //         subJectBox.value=subJectBox.value.slice(0,6)
    //     }

    // }
    // else{
        
    // }

    

    


}

const generateProcess=(port,prompt)=>{
    return new Promise((resolve,reject)=>{
        port.postMessage({generate:true,prompt})
        port.onMessage.addListener(msg=>{
            if(msg.result){
                displayGen(msg.result)
            }
        })
    })
}

const handleQuery=(prompt)=>{
    return new Promise(async(resolve,reject)=>{
        const subJectBox=document.querySelector('input[name="subjectbox"]')
        const msgBox=document.querySelector("div[aria-label='Message Body'][role='textbox'][contentEditable='true']")
        

        //to short
        if(prompt.length<15){
            resolve('Too short')
            quickPrompt('short')
            document.querySelector('.loading_overlay').style.display='none'
        }
        else{
            if (subJectBox.value || msgBox.innerText){
                subJectBox.value=''
                msgBox.innerText=''
            }
            const myPort=chrome.runtime.connect({name:'prompt_exchange'})

            let verification_status=await checkVerification(myPort)
            console.log(verification_status);

            if(verification_status.error){
                // errPrompt(verification_status.message)
                displayError(verification_status.error)
                return
            }
            let usageStatus=await checkUsage(myPort)
            console.log(usageStatus);
            if(usageStatus.proceed && usageStatus.proceed===true){
                generateProcess(myPort,prompt)
            }
            else{
                
            }

            return

    
            

            
            // myPort.postMessage({verify:true,prompt:prompt});
            myPort.onMessage.addListener(function(msg) {
                document.querySelector('.loading_overlay').style.display='none'
                if(msg.err){
                    // chrome.runtime.sendMessage({message: "Unkonown error generating"});
                    // port.disconnect()
                    errPrompt(msg.err)
                }
                if(msg.result){
                    displayGen(msg.result)
    
                }
                if(msg.limit){
                    errPrompt('Limit passed')
                }
                if(msg.warning){
                    errPrompt(msg.warning)
                }
                
            });
        }
    })
    
    
}

const displayError=(errMesssage)=>{
    errMesssage=errMesssage.toLowerCase()
    console.log(errMesssage);
    let displayMessage='Unknown Error'
    let fixMessage='An error occurred. Please reload the extension and try again'
    document.querySelector('.loading_overlay').style.display='none'
    document.querySelector('#errorDivParent').style.display='flex'
    if(errMesssage=='failed to fetch'){
        displayMessage='Network Error'
        fixMessage='Please check your network settings and try again'
    }

    document.querySelector('#errorTitle').innerText=displayMessage
    document.querySelector('#errorExP').innerText=fixMessage


}

const removePrompt=()=>{
    let prpt=document.querySelector('.errParent')
    if(prpt){
        prpt.remove()
    }
    let gen_btn=document.querySelector("#gen_btn")
    gen_btn.disabled=false
}
const quickPrompt=async(clue,prompt)=>{
    chrome.runtime.sendMessage({message:'Running quick'})
    // let pDiv=createElem('div','quickPrompt',null,document.querySelector('.ctrl_div'))
    let meso=createElem('p','quickPrompt',null,document.querySelector('.ctrl_div'))
    if(clue=='short'){
        meso.innerText='Your prompt is too short'
    }
    else{
        meso.innerText=clue
    }
    let pos=-45
    while(pos>-60){
        meso.style.bottom=`${pos}px`
        await sleep(25)
        pos-=5
    }
    await sleep(1300)
    meso.remove()
}

const errPrompt=(type,query)=>{
    // chrome.runtime.sendMessage({message: "Running error prompt"});
    document.querySelector('.loading_overlay').style.display='none'
    let compose_parent=document.querySelector('#compose_parent')
    let errParent=createElem('div','errParent',null,compose_parent)

    let errPrompt=createElem('div','errPrompt',null,errParent)

    let gen_btn=document.querySelector("#gen_btn")
    gen_btn.disabled=true

    let parent=createElem('div',null,null,errPrompt)
    let titleDiv=createElem('div',null,'titleDiv',parent)

    let title=createElem('h3',null,null,titleDiv)
    
    title.style.marginRight='10px'

    let err_icons=createElem('div',null,'err_icons',titleDiv)
    let qu=createElem('span',null,null,err_icons)
    qu.innerHTML='?'
    let rm=createElem('span',null,null,err_icons)
    rm.innerHTML='X'
    rm.addEventListener('click',e=>{
        removePrompt()
    })

    let expls=createElem('div',null,'expls',parent)
    let expla1=createElem('p',null,null,expls)
    let expla2=createElem('p',null,null,expls)

    if(type=='no email'){
        title.innerText=`You are not signed in`
        expla1.innerHTML=`<small>Sign in</small> to your chrome profile with your email to continue`
    }
    else if(type=='no token'){
        title.innerText=`Error logging in`
        expla1.innerHTML=`<small>Reload</small> your <small>extension</small> and try again`

    }
    else if(type=='Your free trial expired'){
        title.innerText=`Trial ended`
        expla1.innerHTML=`You have used up your <small>8/8</small> free trials for the day.`
        expla2.innerHTML=`Upgrade to pro now and enjoy unlimited email generation daily. `
    }
    else if(type=='timeout'){
        title.innerText=`Network error`
        expla1.innerHTML=`Something's wrong with your connection. `
    }
    else if(type=='server error'){
        title.innerText=`Server error`
        expla1.innerHTML=`Our servers are overloaded at the moment. Please try again later.`
    }
    return

    if(type=='Too short'){
    }
    
    else if(type=='Error logging in'){
        expla1.innerHTML=`Oops! Looks like we couldn't log you in`
    }
    else if(type=='You are not signed in'){
        expla1.innerHTML=`Looks like you're not signed in to chrome with an email account`
    }
    else if(type=='Expired authentication'){
        expla1.innerHTML=`Looks like your session has <small>expired</small>. No worries.`
        expla2.innerHTML=`Just <small>reload</small> the <small>extension</small> and the <small>webpage</small> and try again`
    }
    else if(type=='Usage warning'){
        expla1.innerHTML=`You will have <small>1</small> request remaining.`
        expla2.innerHTML=`You have used up<small>7/8</small> of the requests available for users on the <small>free trial</small> plan`
    }
    else if(type=='Limit reached'){
        expla1.innerHTML=`You are on the <small>free trial</small>. With only <small>8</small> free requests daily.`
        expla2.innerHTML=`You will have only <small>1</small> free request left after this one`
    }
    expls.appendChild(expla1)
    expls.appendChild(expla2)

    parent.appendChild(expls)
    

    let btnParent=document.createElement('div')
    let buyBtn=document.createElement('button')
    let cancelBtn=document.createElement('button')
    btnParent.appendChild(buyBtn)
    btnParent.appendChild(cancelBtn)

    // parent.appendChild(btnParent)

    // parent.style.top=rect.top
    // parent.style.left=rect.left

    ctrl_div.appendChild(parent)
    
}

let onSubject



// window.addEventListener('click', function(e){  
//     let prpt=document.querySelector('#errPrompt')
//     if(prpt){
//         if (prpt.contains(e.target)){
//             // Clicked in box
//           } else{
//             removePrompt()
//           }
//     }
    
//   });

