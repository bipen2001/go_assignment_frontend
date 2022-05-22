
let baseUrl="http://localhost:8081"
$('#login').click(()=>{
    let email=$("#login-email").val()
    let password=$("#login-password").val()
    console.log(email,password);
    axios.post(baseUrl+"/login",{email,password},{withCredentials:true}).then(res=>{
        console.log(res);
        window.location.href="index.html"
    })

 })
 $('#signup').click(()=>{
    let email=$("#signup-email").val()
    let password=$("#signup-password").val()
    let firstName=$("#signup-fname").val()
    let lastName=$("#signup-lname").val()

    let dob=new Date($("#signup-dob").val()).toISOString();
    console.log(email,password,firstName,lastName,dob);
    axios.post(baseUrl+"/signup",{email,password,firstName,lastName,dob},{withCredentials:true}).then(res=>{
        console.log(res);
        window.location.href="index.html"
    })

 })