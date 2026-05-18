import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateMonthlySessionInput = {
  monthlyEnd: Scalars['DateTime']['input'];
  monthlyStart: Scalars['DateTime']['input'];
  plateNumber: Scalars['String']['input'];
  rateType: Scalars['String']['input'];
  vehicleType: Scalars['String']['input'];
};

export type CreateParkingSessionInput = {
  plateNumber: Scalars['String']['input'];
  rateType: Scalars['String']['input'];
  vehicleType: Scalars['String']['input'];
};

export type MonthlySubscriptionAnalytics = {
  __typename?: 'MonthlySubscriptionAnalytics';
  activeSubscribers: Scalars['Int']['output'];
  averageSubscriptionValue: Scalars['Float']['output'];
  expired: Scalars['Int']['output'];
  expiringSoon: Scalars['Int']['output'];
  growthRate: Scalars['Float']['output'];
  monthlyRecurringRevenue: Scalars['Float']['output'];
  newThisMonth: Scalars['Int']['output'];
  previousMonthActive: Scalars['Int']['output'];
  previousMonthNew: Scalars['Int']['output'];
  renewalRate: Scalars['Float']['output'];
  retentionRate: Scalars['Float']['output'];
  totalSubscriptions: Scalars['Int']['output'];
  trend: Array<MonthlySubscriptionTrendPoint>;
  utilizationCapacity: Scalars['Int']['output'];
  utilizationRate: Scalars['Float']['output'];
  vehicleBreakdown: VehicleBreakdown;
};

export type MonthlySubscriptionTrendPoint = {
  __typename?: 'MonthlySubscriptionTrendPoint';
  activeAtEnd: Scalars['Int']['output'];
  expired: Scalars['Int']['output'];
  label: Scalars['String']['output'];
  monthKey: Scalars['String']['output'];
  newSubscribers: Scalars['Int']['output'];
  recurringRevenue: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMonthlySession: ParkingSession;
  createParkingSession: ParkingSession;
  exitParkingSession: ParkingSession;
  includeParkingSessionInBIR: ParkingSession;
  updateMonthlySession: ParkingSession;
  updateParkingSession: ParkingSession;
};


export type MutationCreateMonthlySessionArgs = {
  input: CreateMonthlySessionInput;
};


export type MutationCreateParkingSessionArgs = {
  input: CreateParkingSessionInput;
};


export type MutationExitParkingSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationIncludeParkingSessionInBirArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateMonthlySessionArgs = {
  input: UpdateMonthlySessionInput;
};


export type MutationUpdateParkingSessionArgs = {
  input: UpdateParkingSessionInput;
};

export type PaginatedParkingSessions = {
  __typename?: 'PaginatedParkingSessions';
  data: Array<ParkingSession>;
  meta: PaginationMeta;
};

export type PaginationMeta = {
  __typename?: 'PaginationMeta';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type ParkingSession = {
  __typename?: 'ParkingSession';
  durationMinutes?: Maybe<Scalars['Int']['output']>;
  enteredAt: Scalars['DateTime']['output'];
  exitedAt?: Maybe<Scalars['DateTime']['output']>;
  guardRemarks?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  includeInBIRReport: Scalars['Boolean']['output'];
  monthlyEnd?: Maybe<Scalars['DateTime']['output']>;
  monthlyStart?: Maybe<Scalars['DateTime']['output']>;
  occuranceDate: Scalars['String']['output'];
  parkingCredits?: Maybe<Scalars['Int']['output']>;
  parkingFee?: Maybe<Scalars['Float']['output']>;
  parkingState: ParkingState;
  paymentStatus: PaymentStatus;
  plateNumber: Scalars['String']['output'];
  rateType: RateType;
  vehicleModel?: Maybe<Scalars['String']['output']>;
  vehicleType: VehicleType;
};

export enum ParkingState {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Exited = 'EXITED',
  Inactive = 'INACTIVE'
}

export type ParkingStatistics = {
  __typename?: 'ParkingStatistics';
  currentlyParked: Scalars['Int']['output'];
  parkedMotorcycles: Scalars['Int']['output'];
  parkedVehicles: Scalars['Int']['output'];
  revenueToday: Scalars['Float']['output'];
  totalEntriesToday: Scalars['Int']['output'];
};

export enum PaymentStatus {
  Overdue = 'OVERDUE',
  Paid = 'PAID',
  Unpaid = 'UNPAID'
}

export type Query = {
  __typename?: 'Query';
  monthlySessions: PaginatedParkingSessions;
  monthlySubscriptionAnalytics: MonthlySubscriptionAnalytics;
  monthlyTransactions: Array<ParkingSession>;
  parkingSessions: PaginatedParkingSessions;
  parkingSessionsByParkingState: PaginatedParkingSessions;
  parkingStatistics: ParkingStatistics;
  vehicleStats: Array<VehicleStats>;
};


export type QueryMonthlySessionsArgs = {
  expiringWindowDays?: InputMaybe<Scalars['Int']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  rateType: Scalars['String']['input'];
  referenceDate?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  subscriptionStatus?: InputMaybe<Scalars['String']['input']>;
  vehicleType?: InputMaybe<VehicleType>;
};


export type QueryMonthlySubscriptionAnalyticsArgs = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  expiringWindowDays?: InputMaybe<Scalars['Int']['input']>;
  referenceDate?: InputMaybe<Scalars['String']['input']>;
  trendMonths?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMonthlyTransactionsArgs = {
  includeInBIRReport?: InputMaybe<Scalars['Boolean']['input']>;
  month: Scalars['Int']['input'];
  parkingState?: InputMaybe<ParkingState>;
  rateType?: InputMaybe<RateType>;
  year: Scalars['Int']['input'];
};


export type QueryParkingSessionsArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};


export type QueryParkingSessionsByParkingStateArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  includeInBIRReport?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  parkingState: Scalars['String']['input'];
};


export type QueryParkingStatisticsArgs = {
  date: Scalars['String']['input'];
  includeInBIRReport?: InputMaybe<Scalars['Boolean']['input']>;
  parkingState: Scalars['String']['input'];
};


export type QueryVehicleStatsArgs = {
  date: Scalars['DateTime']['input'];
};

export enum RateType {
  Hourly = 'HOURLY',
  Monthly = 'MONTHLY',
  Overnight = 'OVERNIGHT'
}

export type UpdateMonthlySessionInput = {
  id: Scalars['ID']['input'];
  monthlyEnd?: InputMaybe<Scalars['DateTime']['input']>;
  monthlyStart?: InputMaybe<Scalars['DateTime']['input']>;
  parkingFee?: InputMaybe<Scalars['Float']['input']>;
  plateNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateParkingSessionInput = {
  enteredAt?: InputMaybe<Scalars['DateTime']['input']>;
  exitedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  parkingFee?: InputMaybe<Scalars['Float']['input']>;
  plateNumber?: InputMaybe<Scalars['String']['input']>;
};

export type VehicleBreakdown = {
  __typename?: 'VehicleBreakdown';
  cars: Scalars['Int']['output'];
  motorcycles: Scalars['Int']['output'];
  trucks: Scalars['Int']['output'];
};

export type VehicleStats = {
  __typename?: 'VehicleStats';
  name: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export enum VehicleType {
  Car = 'CAR',
  Motorcycle = 'MOTORCYCLE',
  Truck = 'TRUCK'
}

export type CreateMonthlySessionMutationVariables = Exact<{
  input: CreateMonthlySessionInput;
}>;


export type CreateMonthlySessionMutation = { __typename?: 'Mutation', createMonthlySession: { __typename?: 'ParkingSession', id: string, vehicleType: VehicleType, plateNumber: string, enteredAt: any, paymentStatus: PaymentStatus, parkingState: ParkingState, rateType: RateType, parkingFee?: number | null } };

export type CreateParkingSessionMutationVariables = Exact<{
  input: CreateParkingSessionInput;
}>;


export type CreateParkingSessionMutation = { __typename?: 'Mutation', createParkingSession: { __typename?: 'ParkingSession', id: string, vehicleType: VehicleType, plateNumber: string, enteredAt: any, paymentStatus: PaymentStatus, parkingState: ParkingState, rateType: RateType } };

export type ExitParkingSessionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ExitParkingSessionMutation = { __typename?: 'Mutation', exitParkingSession: { __typename?: 'ParkingSession', id: string, parkingState: ParkingState, exitedAt?: any | null, paymentStatus: PaymentStatus } };

export type UpdateMonthlySessionMutationVariables = Exact<{
  input: UpdateMonthlySessionInput;
}>;


export type UpdateMonthlySessionMutation = { __typename?: 'Mutation', updateMonthlySession: { __typename?: 'ParkingSession', id: string, vehicleType: VehicleType, plateNumber: string, enteredAt: any, paymentStatus: PaymentStatus, parkingState: ParkingState, rateType: RateType, parkingFee?: number | null, monthlyStart?: any | null, monthlyEnd?: any | null } };

export type UpdateParkingSessionMutationVariables = Exact<{
  input: UpdateParkingSessionInput;
}>;


export type UpdateParkingSessionMutation = { __typename?: 'Mutation', updateParkingSession: { __typename?: 'ParkingSession', id: string, vehicleType: VehicleType, plateNumber: string, enteredAt: any, exitedAt?: any | null, durationMinutes?: number | null, parkingFee?: number | null, paymentStatus: PaymentStatus, parkingState: ParkingState, rateType: RateType, includeInBIRReport: boolean } };

export type MonthlySessionsQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  rateType: Scalars['String']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  vehicleType?: InputMaybe<VehicleType>;
  subscriptionStatus?: InputMaybe<Scalars['String']['input']>;
  referenceDate?: InputMaybe<Scalars['String']['input']>;
  expiringWindowDays?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MonthlySessionsQuery = { __typename?: 'Query', monthlySessions: { __typename?: 'PaginatedParkingSessions', data: Array<{ __typename?: 'ParkingSession', id: string, vehicleType: VehicleType, plateNumber: string, enteredAt: any, exitedAt?: any | null, durationMinutes?: number | null, parkingFee?: number | null, parkingState: ParkingState, paymentStatus: PaymentStatus, rateType: RateType, includeInBIRReport: boolean, monthlyStart?: any | null, monthlyEnd?: any | null }>, meta: { __typename?: 'PaginationMeta', total: number, page: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean, limit: number } } };

export type GetParkingSessionsQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  parkingState: Scalars['String']['input'];
  date?: InputMaybe<Scalars['String']['input']>;
  includeInBIRReport?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetParkingSessionsQuery = { __typename?: 'Query', parkingSessionsByParkingState: { __typename?: 'PaginatedParkingSessions', data: Array<{ __typename?: 'ParkingSession', id: string, vehicleType: VehicleType, plateNumber: string, enteredAt: any, exitedAt?: any | null, durationMinutes?: number | null, parkingFee?: number | null, parkingState: ParkingState, paymentStatus: PaymentStatus, rateType: RateType, includeInBIRReport: boolean }>, meta: { __typename?: 'PaginationMeta', total: number, page: number, totalPages: number } } };

export type GetParkingStatisticsQueryVariables = Exact<{
  parkingState: Scalars['String']['input'];
  date: Scalars['String']['input'];
  includeInBIRReport?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetParkingStatisticsQuery = { __typename?: 'Query', parkingStatistics: { __typename?: 'ParkingStatistics', parkedVehicles: number, parkedMotorcycles: number, revenueToday: number, currentlyParked: number, totalEntriesToday: number } };

export type IncludeParkingSessionInBirMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type IncludeParkingSessionInBirMutation = { __typename?: 'Mutation', includeParkingSessionInBIR: { __typename?: 'ParkingSession', id: string, vehicleType: VehicleType, plateNumber: string, enteredAt: any, exitedAt?: any | null, durationMinutes?: number | null, parkingFee?: number | null, parkingState: ParkingState, paymentStatus: PaymentStatus, includeInBIRReport: boolean } };

export type MonthlySubscriptionAnalyticsQueryVariables = Exact<{
  referenceDate?: InputMaybe<Scalars['String']['input']>;
  trendMonths?: InputMaybe<Scalars['Int']['input']>;
  expiringWindowDays?: InputMaybe<Scalars['Int']['input']>;
  capacity?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MonthlySubscriptionAnalyticsQuery = { __typename?: 'Query', monthlySubscriptionAnalytics: { __typename?: 'MonthlySubscriptionAnalytics', activeSubscribers: number, expiringSoon: number, expired: number, newThisMonth: number, totalSubscriptions: number, monthlyRecurringRevenue: number, growthRate: number, retentionRate: number, renewalRate: number, previousMonthActive: number, previousMonthNew: number, averageSubscriptionValue: number, utilizationCapacity: number, utilizationRate: number, vehicleBreakdown: { __typename?: 'VehicleBreakdown', cars: number, motorcycles: number, trucks: number }, trend: Array<{ __typename?: 'MonthlySubscriptionTrendPoint', label: string, monthKey: string, newSubscribers: number, expired: number, activeAtEnd: number, recurringRevenue: number }> } };

export type MonthlyTransactionsQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type MonthlyTransactionsQuery = { __typename?: 'Query', monthlyTransactions: Array<{ __typename?: 'ParkingSession', id: string, plateNumber: string, enteredAt: any, exitedAt?: any | null, durationMinutes?: number | null, rateType: RateType, occuranceDate: string, monthlyStart?: any | null, monthlyEnd?: any | null, parkingFee?: number | null, paymentStatus: PaymentStatus, includeInBIRReport: boolean, vehicleType: VehicleType, parkingState: ParkingState }> };

export const CreateMonthlySessionDocument = gql`
    mutation CreateMonthlySession($input: CreateMonthlySessionInput!) {
  createMonthlySession(input: $input) {
    id
    vehicleType
    plateNumber
    enteredAt
    paymentStatus
    parkingState
    rateType
    parkingFee
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateMonthlySessionGQL extends Apollo.Mutation<CreateMonthlySessionMutation, CreateMonthlySessionMutationVariables> {
    override document = CreateMonthlySessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateParkingSessionDocument = gql`
    mutation CreateParkingSession($input: CreateParkingSessionInput!) {
  createParkingSession(input: $input) {
    id
    vehicleType
    plateNumber
    enteredAt
    paymentStatus
    parkingState
    rateType
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateParkingSessionGQL extends Apollo.Mutation<CreateParkingSessionMutation, CreateParkingSessionMutationVariables> {
    override document = CreateParkingSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ExitParkingSessionDocument = gql`
    mutation ExitParkingSession($id: String!) {
  exitParkingSession(id: $id) {
    id
    parkingState
    exitedAt
    paymentStatus
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExitParkingSessionGQL extends Apollo.Mutation<ExitParkingSessionMutation, ExitParkingSessionMutationVariables> {
    override document = ExitParkingSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMonthlySessionDocument = gql`
    mutation UpdateMonthlySession($input: UpdateMonthlySessionInput!) {
  updateMonthlySession(input: $input) {
    id
    vehicleType
    plateNumber
    enteredAt
    paymentStatus
    parkingState
    rateType
    parkingFee
    monthlyStart
    monthlyEnd
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMonthlySessionGQL extends Apollo.Mutation<UpdateMonthlySessionMutation, UpdateMonthlySessionMutationVariables> {
    override document = UpdateMonthlySessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateParkingSessionDocument = gql`
    mutation UpdateParkingSession($input: UpdateParkingSessionInput!) {
  updateParkingSession(input: $input) {
    id
    vehicleType
    plateNumber
    enteredAt
    exitedAt
    durationMinutes
    parkingFee
    paymentStatus
    parkingState
    rateType
    includeInBIRReport
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateParkingSessionGQL extends Apollo.Mutation<UpdateParkingSessionMutation, UpdateParkingSessionMutationVariables> {
    override document = UpdateParkingSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MonthlySessionsDocument = gql`
    query MonthlySessions($page: Int!, $limit: Int!, $rateType: String!, $search: String, $vehicleType: VehicleType, $subscriptionStatus: String, $referenceDate: String, $expiringWindowDays: Int) {
  monthlySessions(
    page: $page
    limit: $limit
    rateType: $rateType
    search: $search
    vehicleType: $vehicleType
    subscriptionStatus: $subscriptionStatus
    referenceDate: $referenceDate
    expiringWindowDays: $expiringWindowDays
  ) {
    data {
      id
      vehicleType
      plateNumber
      enteredAt
      exitedAt
      durationMinutes
      parkingFee
      parkingState
      paymentStatus
      rateType
      includeInBIRReport
      monthlyStart
      monthlyEnd
    }
    meta {
      total
      page
      totalPages
      hasNextPage
      hasPreviousPage
      limit
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MonthlySessionsGQL extends Apollo.Query<MonthlySessionsQuery, MonthlySessionsQueryVariables> {
    override document = MonthlySessionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetParkingSessionsDocument = gql`
    query GetParkingSessions($page: Int!, $limit: Int!, $parkingState: String!, $date: String, $includeInBIRReport: Boolean) {
  parkingSessionsByParkingState(
    page: $page
    limit: $limit
    parkingState: $parkingState
    date: $date
    includeInBIRReport: $includeInBIRReport
  ) {
    data {
      id
      vehicleType
      plateNumber
      enteredAt
      exitedAt
      durationMinutes
      parkingFee
      parkingState
      paymentStatus
      rateType
      includeInBIRReport
    }
    meta {
      total
      page
      totalPages
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetParkingSessionsGQL extends Apollo.Query<GetParkingSessionsQuery, GetParkingSessionsQueryVariables> {
    override document = GetParkingSessionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetParkingStatisticsDocument = gql`
    query GetParkingStatistics($parkingState: String!, $date: String!, $includeInBIRReport: Boolean) {
  parkingStatistics(
    parkingState: $parkingState
    date: $date
    includeInBIRReport: $includeInBIRReport
  ) {
    parkedVehicles
    parkedMotorcycles
    revenueToday
    currentlyParked
    totalEntriesToday
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetParkingStatisticsGQL extends Apollo.Query<GetParkingStatisticsQuery, GetParkingStatisticsQueryVariables> {
    override document = GetParkingStatisticsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const IncludeParkingSessionInBirDocument = gql`
    mutation IncludeParkingSessionInBIR($id: String!) {
  includeParkingSessionInBIR(id: $id) {
    id
    vehicleType
    plateNumber
    enteredAt
    exitedAt
    durationMinutes
    parkingFee
    parkingState
    paymentStatus
    includeInBIRReport
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IncludeParkingSessionInBirGQL extends Apollo.Mutation<IncludeParkingSessionInBirMutation, IncludeParkingSessionInBirMutationVariables> {
    override document = IncludeParkingSessionInBirDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MonthlySubscriptionAnalyticsDocument = gql`
    query MonthlySubscriptionAnalytics($referenceDate: String, $trendMonths: Int, $expiringWindowDays: Int, $capacity: Int) {
  monthlySubscriptionAnalytics(
    referenceDate: $referenceDate
    trendMonths: $trendMonths
    expiringWindowDays: $expiringWindowDays
    capacity: $capacity
  ) {
    activeSubscribers
    expiringSoon
    expired
    newThisMonth
    totalSubscriptions
    monthlyRecurringRevenue
    growthRate
    retentionRate
    renewalRate
    previousMonthActive
    previousMonthNew
    averageSubscriptionValue
    utilizationCapacity
    utilizationRate
    vehicleBreakdown {
      cars
      motorcycles
      trucks
    }
    trend {
      label
      monthKey
      newSubscribers
      expired
      activeAtEnd
      recurringRevenue
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MonthlySubscriptionAnalyticsGQL extends Apollo.Query<MonthlySubscriptionAnalyticsQuery, MonthlySubscriptionAnalyticsQueryVariables> {
    override document = MonthlySubscriptionAnalyticsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MonthlyTransactionsDocument = gql`
    query MonthlyTransactions($year: Int!, $month: Int!) {
  monthlyTransactions(year: $year, month: $month) {
    id
    plateNumber
    enteredAt
    exitedAt
    durationMinutes
    rateType
    occuranceDate
    monthlyStart
    monthlyEnd
    parkingFee
    paymentStatus
    includeInBIRReport
    vehicleType
    parkingState
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MonthlyTransactionsGQL extends Apollo.Query<MonthlyTransactionsQuery, MonthlyTransactionsQueryVariables> {
    override document = MonthlyTransactionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }