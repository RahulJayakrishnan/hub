import grpc from '@grpc/grpc-js';
import { IdRegistryEvent } from '~/flatbuffers/generated/id_registry_event_generated';
import { Message } from '~/flatbuffers/generated/message_generated';
import { NameRegistryEvent } from '~/flatbuffers/generated/name_registry_event_generated';
import IdRegistryEventModel from '~/flatbuffers/models/idRegistryEventModel';
import MessageModel from '~/flatbuffers/models/messageModel';
import NameRegistryEventModel from '~/flatbuffers/models/nameRegistryEventModel';
import { HubInterface } from '~/flatbuffers/models/types';
import { toServiceError } from '~/rpc/server';
import { HubError } from '~/utils/hubErrors';

export const submitImplementation = (hub: HubInterface) => {
  return {
    submitMessage: async (call: grpc.ServerUnaryCall<Message, Message>, callback: grpc.sendUnaryData<Message>) => {
      const model = new MessageModel(call.request);
      const result = await hub.submitMessage(model, 'rpc');
      result.match(
        () => {
          callback(null, model.message);
        },
        (err: HubError) => {
          callback(toServiceError(err));
        }
      );
    },

    submitIdRegistryEvent: async (
      call: grpc.ServerUnaryCall<IdRegistryEvent, IdRegistryEvent>,
      callback: grpc.sendUnaryData<IdRegistryEvent>
    ) => {
      const model = new IdRegistryEventModel(call.request);
      const result = await hub.submitIdRegistryEvent(model, 'rpc');
      result.match(
        () => {
          callback(null, model.event);
        },
        (err: HubError) => {
          callback(toServiceError(err));
        }
      );
    },

    submitNameRegistryEvent: async (
      call: grpc.ServerUnaryCall<NameRegistryEvent, NameRegistryEvent>,
      callback: grpc.sendUnaryData<NameRegistryEvent>
    ) => {
      const model = new NameRegistryEventModel(call.request);
      const result = await hub.submitNameRegistryEvent(model, 'rpc');
      result.match(
        () => {
          callback(null, model.event);
        },
        (err: HubError) => {
          callback(toServiceError(err));
        }
      );
    },
  };
};
