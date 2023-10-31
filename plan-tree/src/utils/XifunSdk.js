import LocalDb from "./localDb"
import OnlineSize from "./OnlineDb";
export default {
    getSite(type) {
        return new LocalDb(1, {});
    }
}
