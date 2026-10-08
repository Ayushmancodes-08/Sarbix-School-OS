
import { EventEmitter } from 'events';
import { SupabasePermissionError } from './errors';

class ErrorEmitter extends EventEmitter {
  emit(event: 'permission-error', error: SupabasePermissionError): boolean;
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }
}

export const errorEmitter = new ErrorEmitter();
