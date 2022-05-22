let table_data=[];
let curId=-1;
let BASE_URL="http://localhost:8081"
const instance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL
 })

const validationRules={
    firstName: {
        required:true,
        minlength: 1
    },
    lastName: {
        required:true,
        minlength: 1
    },
    password:{
        required:true,
        minlength: 8
    },
    dob:{
        required:true,
        minlength: 1
    },
    email: {
      required: true,
      email: true
    }
};

window.onload = () => {
    // adding listener to add employee button
    // $("#add-emp-btn").click(()=>{
    //     createValidate()
    // })

    readEmployee(); 
}
$("#search-email").click(()=>{
    $('#table_id').DataTable().clear().draw();
    readEmployee("?email="+$("#input-email").val())
})
$("#search-firstName").click(()=>{
    $('#table_id').DataTable().clear().draw();
    readEmployee("?firstName="+$("#input-firstName").val())
})
$("#search-lastName").click(()=>{
    $('#table_id').DataTable().clear().draw();
    readEmployee("?lastName="+$("#input-lastName").val())
})

 // read Employee
 let readEmployee = (queryStr="")=>{
    let data =  JSON.parse(sessionStorage.getItem("employeeArray"));
    console.log(data);
    instance.get("/user"+queryStr).then((res)=>{
        data=res.data.data;
        if(data.length){
            table_data=data;
        data.forEach((el,i)=>{
            $('#table_id').DataTable().row.add(
               [i+1, el.firstName, el.lastName,el.age,el.email,el.dob,`<div>
               <a href="#editEmployeeModal"  id="${el.id}" class="edit edit-btn" data-toggle="modal" ><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
               <a href="#deleteEmployeeModal" id="${el.id}" data-toggle="modal" class="delete delete-btn" ><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
               </div> `]               
                
                ).draw( false );
        })
        }
        // Adding listener to all edit buttons
    document.querySelectorAll(".edit-btn").forEach((el,i)=>{    
        el.addEventListener("click",()=>{
            updateValidate();
            onClickEditBtn(el.id);
        })
    })

    // Adding listener to all delete buttons
    document.querySelectorAll(".delete-btn").forEach((el,i)=>{
        el.addEventListener("click",()=>{
            curId=el.id;          
        })
    })
    }).catch(err=> {
        console.log(err)
        window.location.href="login.html"
    })
    // if(data){
    //     table_data=data;
    //     data.forEach((el,i)=>{
    //         $('#table_id').DataTable().row.add(
    //            [i+1, el.name, el.code,el.email,el.gender,el.designation,el.dob,`<div>
    //            <a href="#editEmployeeModal"  id="${i}" class="edit edit-btn" data-toggle="modal" ><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
    //            <a href="#deleteEmployeeModal" id="${i}" data-toggle="modal" class="delete delete-btn" ><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
    //            </div> `]               
                
    //             ).draw( false );
    //     })
        
    // }
    

}

// create employee
// let createValidate=()=>{
//     $("#addForm").validate({ rules:{
//         ...validationRules
//       },
//       submitHandler: function(form) {
//         createEmployee();
//       }
//     });
// }

//update employee
let updateValidate=()=>{
    $("#editForm").validate({ rules:{
        ...validationRules
      },
      submitHandler: function(form) {
        updateEmployee();
      }
    });
}

//delete employee
$('#delete').click(()=>{
    // alert("Hi")
   deleteEmployee();
})


let createEmployee = ()=>{
    event.preventDefault();

    const data = {};
    
     let email = $('#email').val();
     let firstName = $('#firstName').val();
     let lastName = $('#lastName').val();
     let password = $('#password').val();
     let dob = new Date($('#dob').val()).toISOString();

    instance.post("/user",{email,firstName,lastName,password,dob})
    // table_data.push(data);
    // window.sessionStorage.setItem("employeeArray", JSON.stringify(table_data));
    document.getElementById("addForm").reset();
    $('#addEmployeeModal').modal('hide');  

    $('#table_id').DataTable().clear().draw();

    readEmployee();   

}

let updateEmployee=()=>{
    let email = $('#edit-email').val();
    let firstName = $('#edit-firstName').val();
    let lastName = $('#edit-lastName').val();
    let dob = new Date($('#edit-dob').val()).toISOString();
    //  console.log(data);
    instance.patch("/user/"+curId,{email,firstName,lastName,dob}).then(()=>{
        $('#editEmployeeModal').modal('hide');
        $('#table_id').DataTable().clear().draw();
        
        readEmployee();
    }).catch(err=>{
        $('#editEmployeeModal').modal('hide');
        alert("You are not allowed to perform this action!")
        console.log(err);
    })
    
    // table_data[curId]= data;
    // console.log(table_data);
    // window.sessionStorage.setItem("employeeArray", JSON.stringify(table_data));
    
}

let deleteEmployee=()=>{
   instance.delete("/user/"+curId).then(()=>{
    console.log("deleted");
    $('#deleteEmployeeModal').modal('hide');
    $('#table_id').DataTable().clear().draw();
        readEmployee();
   }).catch(err=>{
    $('#deleteEmployeeModal').modal('hide');
    alert("You are not allowed to perform this action!")
       console.log(err);
   })
}


let onClickEditBtn=(id)=>{
    instance.get("/user/"+id).then((res)=>{
        let {data}=res;

    $('#edit-email').val(data.email);
    $('#edit-firstName').val(data.firstName);
    $('#edit-lastName').val(data.lastName);
    $('#edit-dob').val(data.dob.split("T")[0]);
    })
    curId = id;
}

$('#editEmployeeModal').on('hidden.bs.modal', function () {
    curId=-1;    
  })

$('#deleteEmployeeModal').on('hidden.bs.modal', function () {
    curId=-1;    
  })



 