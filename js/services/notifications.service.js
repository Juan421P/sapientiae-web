import { Network } from './../lib/network';

export class NotificationService {
    static _ENDPOINT = '/Notifications';

    static async get() {
        return await Network.get({ 
            path: `${this._ENDPOINT}/getNotifications` 
        });
    }

    static async getPagination(page = 0, size = 10) {
        return await Network.get({ 
            path: `${this._ENDPOINT}/getNotificationPagination?page=${page}&size=${size}` 
        });
    }

    static async post(data) {
        return await Network.post({ 
            path: `${this._ENDPOINT}/newNotification`, 
            body: data 
        });
    }

    static async put(id, data) {
        return await Network.put({ 
            path: `${this._ENDPOINT}/updateNotification/${id}`, 
            body: data 
        });
    }

    static async delete(id) {
        return await Network.delete({ 
            path: `${this._ENDPOINT}/deleteNotification/${id}` 
        });
    }
}