import Category from "./Category";
import {updateApparel} from "../../slices/appInformation"


export default function Apparel()
{
    return <Category category="Apparel" action={updateApparel} />
}