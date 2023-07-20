import React from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import Navbar from '../../components/Navbar'
import "../../css/backupstyle.css"
import { useState ,useEffect} from 'react'
import axios from 'axios'
const Order = () => {
    const [loggedUser, setLoggedUser] = useState()
    const [orders, setOrders] = useState([])
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchOrders();
      
        return () => {
        }
      }, [])
    const fetchOrders=async ()=>{
        try{
            const config={
              headers:{
                Authorization:`Bearer ${loggedUser.token}`
              },      
            };
            const {data}=await axios.get("api/chat",config);
            setOrders(data);
          }catch(error){
            alert("Errorrr")
          }
    }
    
  return (
    <>
        <Navbar searchBar={false} admin={true} />
        <div className='container mt-5' >
        <table class="table table-striped">
            <thead>
            <tr>
                <th scope="col">Order ID</th>
        
                            <th scope="col">Order Name</th>
                            <th scope="col">Cost</th>
                            <th scope="col">Placed On</th>
                            <th scope="col">Expected Delivery</th>
                            <th scope="col">Info</th>
                            </tr></thead>
                            
                    {orders?(
                        <tbody>
                        {orders.map((order)=>(
                            
                            <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>100</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>
                                <Link to={`/admin/order-details/5`}>
                                <button type="button" class="btn btn-info">
                                    View
                                </button>
                                </Link>

                            </td>
                        </tr>
                            
                       
                    
                        ))}</tbody>
                        
                    ):(<div>Still Loading</div>)}
                    </table>
                    
                


            </div>
    </>
  )
}

export default Order