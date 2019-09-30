(function(){

  let btn = document.getElementById('run')

  if(btn===null){
    console.error("CANT FIND BUTTON")
    return
  }
  let resStatus = document.getElementById('resStatus')
  let results = document.getElementById('results')
  function outputStatus(status){
    resStatus.value = status
  }
  function outputResults(data){
    results.innerHTML = JSON.stringify(data,null,2)
  }

  let apiOption = document.getElementById('endpoint')

  btn.onclick = function(e){
    if(e.target.attributes.disabled) return
    e.target.attributes.disabled = true
    outputStatus(null)
    outputResults(null)
    let api = apiOption.value
    fetch(api,{
      method: 'GET',
      //mode: 'no-cors',
      headers: {
        'Content-Type': 'application/type',
        'sso-token': 'XYZ'
      }
    })
    .then(res=>{
      outputStatus(res.status)
      if(res.status >= 400){
        return {error: res.statusText}
      }
      return res.json()
    })
    .then(outputResults)
    .catch(err=>{
      console.log(err)
      outputResults(err.message)
    })
    .finally(()=>{
      e.target.attributes.disabled = false
    })
  }
})();