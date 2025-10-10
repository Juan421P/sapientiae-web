import { Service } from './../lib/service.js';
import { NotificationsContract } from './../contracts/notifications.contract.js';

export class NotificationsService extends Service {
    
    static baseEndpoint = '/Notifications';
    static contract = new NotificationsContract();

    static async list() {
        return await this.get('getNotifications', null, 'table');
    }

    static async create(notificationData) {
        return await this.post('newNotification', notificationData, 'create');
    }

    // Si más adelante necesitas update, lo puedes habilitar aquí
    // static async update(notificationData) {
    //     return await this.put('updateNotification', notificationData, 'update');
    // }

    static async delete(id) {
        return await this.delete('deleteNotification', id);
    }
}