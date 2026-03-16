import { Event } from './events';

export interface Observer {
  subscribe<T extends Event>(eventType: string, handler: (event: T) => void): void;
  unsubscribe<T extends Event>(eventType: string, handler: (event: T) => void): void;
  emit<T extends Event>(event: T): void;
}

export class EventEmitter implements Observer {
    private handlers: { [eventType: string]: Array<(event: Event) => void> } = {};

    subscribe<T extends Event>(eventType: string, handler: (event: T) => void): void {
        if (!this.handlers[eventType]) {
            this.handlers[eventType] = [];
        }
        this.handlers[eventType].push(handler as (event: Event) => void);
    }

    unsubscribe<T extends Event>(eventType: string, handler: (event: T) => void): void {
        if (this.handlers[eventType]) {
            const index = this.handlers[eventType].indexOf(handler as (event: Event) => void);
            if (index > -1) {
                this.handlers[eventType].splice(index, 1);
            }
        }
    }

    emit<T extends Event>(event: T): void {
        const eventType = event.type;
        if (this.handlers[eventType]) {
            this.handlers[eventType].forEach(handler => handler(event));
        }
    }
}