const HOST=`http://localhost:5000`
let chromeID
let profEmail
let ckToken

  const initiateUser=async(email,id)=>{
    return new Promise(async(resolve,reject)=>{
      fetch(`${HOST}/accounts/init?chrome_id=${id}&email=${email}`,{
            method:'GET'
          }
      )
      .then(async response=>{
        let res=await response.json()
        if(response.status==200){
          ckToken=res.ghostToken;
          console.log('token set');
          chrome.storage.local.set({ghostMailState:'loggedIn',ghostToken:ckToken})
          resolve({success:true,token:res.ghostToken})
        }
        else{
          chrome.storage.local.set({ghostMailState:res.message})
          resolve({error:res.message})
        }
      })
      .catch (error=>{
        //error
        resolve({error:error.message})
      })
     
    })}


chrome.identity.getProfileUserInfo({accountStatus:"ANY"},(profile)=>{
  let {email,id}=profile
  if(email){
    console.log('Profile details:',email,id);
    chromeID=id
    profEmail=email
    initiateUser(email,id)

  }
  else{
    console.log('missing email attached to chrome profile');
    chrome.storage.local.set({ghostMailState:'missing email'})
  }
})

// chrome.cookies.getAll({url:'http://localhost:3000'},(ck)=>{
//     console.log(ck)
//   })

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message) {
      console.log(request);
      // Add your code here to do something when someone is in Gmail.
    }
    if(request.stopGen){
      console.log('STOPPING...');
      keepReading=false
    }
    if(request.getPrompts){
      sendResponse({def_prompts:example_prompts})
    }
    if(request.getLang){
      let tab=sender.tab.id
      console.log('Received getLang from',tab);
      chrome.storage.sync.get("set_lang").then((result) => {
        if(result.set_lang){
          console.log('Found language',result.set_lang);
          chrome.tabs.sendMessage(tab,{setLang:result.set_lang})
        }
        else{
          console.log('No language found');
          chrome.tabs.sendMessage(tab,{setLang:'false'})
        }
      });
    }

    if(request.setLang){
      chrome.storage.sync.set({"set_lang":request.setLang})
      console.log('Language set to',request.setLang);
    }
  });

  

chrome.runtime.onConnect.addListener(port=>{
  port.onMessage.addListener(async(message,port)=>{
    if(message.verify){
      if(profEmail){
        console.log('profEmail is there');
        let initResponse
        initResponse=await initiateUser(profEmail,chromeID)
        console.log(initResponse);
        port.postMessage(initResponse)
      }else{
        //If missing email
        console.log('profEmail is NOT there');
        chrome.storage.local.set({ghostMailState:'missing email'})
        port.postMessage({err:'missing email'})
      }
      // resolve({allowed,userType,to_rem})
    }

    else if(message.getEmail){
      port.postMessage({userEmail:profEmail})
    }

    else if(message.checkUsage){
      let status=await verifyUserUsage()
      port.postMessage(status)

    }

    else if(message.generate){
      let status
      continueToGenerate(message.prompt,port)    

    }
  })
})



  

  const verifyUserUsage=async()=>{
    return new Promise(async(resolve,reject)=>{
        let res

          fetch(`http://localhost:5000/accounts/verify?chrome_id=${chromeID}&email=${profEmail}`,{
          method:'GET',
          headers:{
            "Authorization":ckToken
          }
        })
        .then(async response=>{
          if(response.status==200){
            let userPerm=await response.json()
            let allowed=userPerm.allow
            allowed?resolve({allowed}):resolve({allowed,reason:userPerm.reason})
            
          }
          else{
            resolve({error:true,message:'Authentication failed. Please login to profile'})
            chrome.storage.local.set({ghostMailState:'expired'})
          }
        })
        .catch(err=>{
          resolve({error:true,message:err.message})
        }) 
    })
    
  }

  const example_prompts=[
    'to my boss asking for a raise',
    "to my teacher, submitting my assignment",
    "responding to a client who filed a complaint about our customer service",
    "to my former boss, asking for a letter of recommendation",
    "to my teammates, reminding them of our meeting tommorrow",
    "submitting my two weeks notice"
  ]

  

  let keepReading=true

  const continueToGenerate=async(prompt,port)=>{
    keepReading=true
    return new Promise(async(resolve,reject)=>{
        let res=await fetch(`http://localhost:5000/generate/mail?chrome_id=${chromeID}&email=${profEmail}`,{
        method:'POST',
        headers:{
          "Authorization":ckToken,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          prompt:prompt
        })
      })
      .catch(error=>{
        console.log(error);
      })

      console.log(res.status);

      const ourReader = res.body.getReader();

      const readStream=(reader)=>{
        return new Promise(async(resolve)=>{
          var string
          while(true && keepReading){
            const {value}=await reader.read()
            string = new TextDecoder().decode(value);

            if(string.includes('STREAM COMPLETELEY FINISHED')){
              string=string.replace('STREAM COMPLETELEY FINISHED', '')
              displayGenerated(string,port)
              break
            }
            displayGenerated(string,port)
            
          }
          resolve(string)
        })
      }

      const finishedStream=await Promise.race([readStream(ourReader),sleep(20000)])

      console.log(finishedStream);

    })
    
  }

  const displayGenerated=(string,port)=>{
    try{
      port.postMessage({result:string})

    }
    catch(err){
      console.log(err);

    }
    
  }

  const sleep=(ms)=>{
    return new Promise(resolve=>setTimeout(resolve,ms))
  }

  const lans={
    sq:"Albanian - shqip",af:'Afrikaans', am:'Amharic - አማርኛ', ar:'Arabic - العربية', hy:"Armenian - հայերեն",bg:"Bulgarian - български",be:"Belarusian - беларуская",
    zh:'Chinese - 中文',"zh-HK":"Chinese (Hong Kong) - 中文（香港)", "zh-CN":"Chinese (Simplified) - 中文（简体)", "zh-TW":"Chinese (Traditional) - 中文（繁體",
    hr:"Croatian - hrvatski",cs:"Czech - čeština", da:"Danish - dansk", nl:"Dutch - Nederlands", en:"English",
    'en-GB':"English (United Kingdom)", "en-US":"English (United States)",fil:"Filipino",fi:"Finnish - suomi",
    fr:"French - français", de:"German",el:"Greek - Ελληνικά",gu:"Gujarati - ગુજરાતી",he:"Hebrew",hi:"Hindi",hu:"Hungarian - magyar",
    is:"Icelandic - íslenska",id:"Indonesian - Indonesia",ga:"Irish - Gaeilge",it:"Italian - italiano",ja:"Japanese - 日本語",
    ko:"Korean - 한국어",ku:"Kurdish - Kurdî",la:"Latin",mn:"Mongolian",no:"Norwegian - norsk",pl:"Polish - polski",fs:"Persian - فارسی",
    sw:"Kiswahili", sv:'Swedish',pt:"Portuguese - português","pt-BR":"Portuguese (Brazil) - português (Brasil)",ru:"Russian - русский",sr:"Serbian - српски",
    et:"Estonian - eesti",vi:"Vietnamese - Tiếng Việt",cy:"Welsh - Cymraeg"

}
