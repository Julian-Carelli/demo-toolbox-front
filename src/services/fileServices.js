import { config } from "../config/config"

export const getFiles = async (fileName) => {
    try {
        const response = await fetch(`${config.REACT_APP_DEMO_TOOLBOX_BACK_API}/files/data?fileName=${fileName}`)
        const result = await response.json();
        return result
    } catch (error) {
        console.log(error.message)
        console.error('Error fetching data:', error);
    }
}