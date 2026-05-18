import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client';

import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DEFAULT_DATE_FORMAT } from './shared/utils/date-format';

import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { provideEchartsCore } from 'ngx-echarts';
import {
  TooltipComponent,
  VisualMapComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { environment } from '../environments/environment';
echarts.use([LineChart, BarChart, GridComponent, VisualMapComponent, LegendComponent, TooltipComponent, CanvasRenderer, PieChart]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideLuxonDateAdapter(DEFAULT_DATE_FORMAT),
    provideBrowserGlobalErrorListeners(),
    provideEchartsCore({ echarts }),
    provideRouter(routes), 
    provideHttpClient(), 
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const authLink = new ApolloLink((operation, forward) => {
        const token = typeof localStorage !== 'undefined'
          ? localStorage.getItem('sex-sex-iyot')
          : null;
        if (token) {
          operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
            headers: { ...headers, Authorization: `Bearer ${token}` },
          }));
        }
        return forward(operation);
      });

      return {
        link: ApolloLink.from([
          authLink,
          httpLink.create({ uri: environment.apiBaseUrl + '/graphql' }),
        ]),
        cache: new InMemoryCache(),
      };
    })
  ]
};
