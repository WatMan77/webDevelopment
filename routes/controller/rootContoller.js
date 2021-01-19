import { root } from "../../service/rootService.js"
import { getEmail } from "./authController.js"

const getRoot = async({session, render}) => {
    const id = await session.get('id');
    const moods = await root(id);
    const data = {
        today: moods.today,
        yesterday: moods.yesterday,
        message: moods.message,
        user: await getEmail({session})
    }

    render('root.ejs', data);
}

export { getRoot }

