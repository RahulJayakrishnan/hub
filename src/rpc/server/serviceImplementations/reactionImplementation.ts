import grpc from '@grpc/grpc-js';
import { CastId, Message } from '~/flatbuffers/generated/message_generated';
import * as rpc_generated from '~/flatbuffers/generated/rpc_generated';
import { ReactionAddModel } from '~/flatbuffers/models/types';
import { toMessagesResponse, toServiceError } from '~/rpc/server';
import Engine from '~/storage/engine';
import { HubError } from '~/utils/hubErrors';

export const reactionImplementation = (engine: Engine) => {
  return {
    getReaction: async (
      call: grpc.ServerUnaryCall<rpc_generated.GetReactionRequest, Message>,
      callback: grpc.sendUnaryData<Message>
    ) => {
      const result = await engine.getReaction(
        call.request.fidArray() ?? new Uint8Array(),
        call.request.type(),
        call.request.cast() ?? new CastId()
      );
      result.match(
        (model: ReactionAddModel) => {
          callback(null, model.message);
        },
        (err: HubError) => {
          callback(toServiceError(err));
        }
      );
    },

    getReactionsByFid: async (
      call: grpc.ServerUnaryCall<rpc_generated.GetReactionsByFidRequest, rpc_generated.MessagesResponse>,
      callback: grpc.sendUnaryData<rpc_generated.MessagesResponse>
    ) => {
      const result = await engine.getReactionsByFid(
        call.request.fidArray() ?? new Uint8Array(),
        call.request.type() ?? undefined
      );
      result.match(
        (messages: ReactionAddModel[]) => {
          callback(null, toMessagesResponse(messages));
        },
        (err: HubError) => {
          callback(toServiceError(err));
        }
      );
    },

    getReactionsByCast: async (
      call: grpc.ServerUnaryCall<rpc_generated.GetReactionsByCastRequest, rpc_generated.MessagesResponse>,
      callback: grpc.sendUnaryData<rpc_generated.MessagesResponse>
    ) => {
      const result = await engine.getReactionsByCast(
        call.request.cast() ?? new CastId(),
        call.request.type() ?? undefined
      );
      result.match(
        (messages: ReactionAddModel[]) => {
          callback(null, toMessagesResponse(messages));
        },
        (err: HubError) => {
          callback(toServiceError(err));
        }
      );
    },
  };
};
