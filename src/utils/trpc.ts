// src/utils/trpc.ts
import type { AppRouter } from "../server/router";
import { createReactQueryHooks } from "@trpc/react";
import { inferProcedureInput, inferProcedureOutput } from "@trpc/server";

export const trpc = createReactQueryHooks<AppRouter>();

/**
 * Check out tRPC docs for Inference Helpers
 * https://trpc.io/docs/infer-types#inference-helpers
 */

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof AppRouter["_def"]["queries"];

/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof AppRouter["_def"]["mutations"];

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> =
  inferProcedureOutput<AppRouter["_def"]["mutations"][TRouteKey]>;

/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> =
  inferProcedureInput<AppRouter["_def"]["mutations"][TRouteKey]>;
