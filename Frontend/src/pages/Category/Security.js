import Category from "./Category";
import {updateSecurity} from "../../slices/appInformation"


export default function Security()
{
    return <Category category="Security" action={updateSecurity}/>
}