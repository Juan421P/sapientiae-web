import { Service } from './../lib/service.js';

export class DeliveriesService extends Service {

	static baseEndpoint = '/Deliveries';

	static _deliveries = [
		{
			trackingID: 'JP-125',
			title: 'Paquete de Amazon',
			sender: 'Almacén de Amazon',
			estimatedDelivery: '2025-12-01',
			status: 'En Tránsito',
			imgURL: 'https://i.imgur.com/dASKMK5.jpeg',
			steps: [
				{ stepID: 1, description: 'Pedido Realizado', timestamp: '2025-11-20T10:00:00Z', isCompleted: true },
				{ stepID: 2, description: 'Enviado desde el almacén', timestamp: '2025-11-21T14:30:00Z', isCompleted: true },
				{ stepID: 3, description: 'Llegó a la central de clasificación', timestamp: '2025-11-22T08:15:00Z', isCompleted: true },
				{ stepID: 4, description: 'En tránsito al centro local', timestamp: '2025-11-23T06:00:00Z', isCompleted: false },
				{ stepID: 5, description: 'En reparto', timestamp: null, isCompleted: false },
				{ stepID: 6, description: 'Entregado', timestamp: null, isCompleted: false }
			]
		},
		{
			trackingID: 'EM-47',
			title: 'Documentos de la Oficina Principal',
			sender: 'Sede Corporativa',
			estimatedDelivery: '2025-11-25',
			status: 'Entregado',
			imgURL: 'https://i.imgur.com/C2J8XP3.jpeg',
			steps: [
				{ stepID: 1, description: 'Enviado por el remitente', timestamp: '2025-11-23T10:00:00Z', isCompleted: true },
				{ stepID: 2, description: 'Llegó al centro de destino', timestamp: '2025-11-24T18:00:00Z', isCompleted: true },
				{ stepID: 3, description: 'Entregado al destinatario', timestamp: '2025-11-25T09:30:00Z', isCompleted: true }
			]
		}
	];

	static async find(trackingID) {
		return new Promise(resolve => {
			setTimeout(() => {
				const delivery = this._deliveries.find(d => d.trackingID === trackingID);
				resolve(delivery ? {
					trackingID: delivery.trackingID,
					title: delivery.title,
					status: delivery.status,
					imgURL: delivery.imgURL
				} : null);
			}, 200);
		});
	}

	static async getDetails(trackingID) {
		return new Promise(resolve => {
			setTimeout(() => {
				const delivery = this._deliveries.find(d => d.trackingID === trackingID);
				resolve(delivery);
			}, 800);
		});
	}

	static async updateStep(trackingID, stepID, isCompleted) {
		return new Promise(resolve => {
			setTimeout(() => {
				const delivery = this._deliveries.find(d => d.trackingID === trackingID);
				if (delivery) {
					const step = delivery.steps.find(s => s.stepID === stepID);
					if (step) {
						step.isCompleted = isCompleted;
						step.timestamp = isCompleted ? new Date().toISOString() : null;
						resolve(true);
						return;
					}
				}
				resolve(false);
			}, 300);
		});
	}
}