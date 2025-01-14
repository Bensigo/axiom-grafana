import React, { ChangeEvent } from 'react';
import { InlineField, SecretInput, Input, Label } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { AxiomDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<AxiomDataSourceOptions, MySecureJsonData> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;
  const onHostChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      apiHost: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  const onAccessTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      secureJsonData: {
        accessToken: event.target.value,
      },
    });
  };

  const onResetAccessToken = () => {
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        accessToken: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        accessToken: '',
      },
    });
  };

  const { secureJsonFields } = options;
  const jsonData = (options.jsonData || {}) as AxiomDataSourceOptions;
  const secureJsonData = (options.secureJsonData || {}) as MySecureJsonData;

  return (
    <div className="gf-form-group">
      <Label
        description={
          <span>
            Create an API token from your&nbsp;
            <a href="https://app.axiom.co/profile" target="_blank" rel="noreferrer">
            Axiom organization settings
            </a>
            .
          </span>
        }
      >
        <h5>Authentication</h5>
      </Label>
      <InlineField label="API Token" labelWidth={12}>
        <SecretInput
          isConfigured={(secureJsonFields && secureJsonFields.accessToken) as boolean}
          value={secureJsonData.accessToken || ''}
          placeholder="xaat-***********"
          width={40}
          onReset={onResetAccessToken}
          onChange={onAccessTokenChange}
        />
      </InlineField>
      <br />
      { window.location.hostname === 'localhost' ? ( 
        <div>
          <Label description="The Axiom host to use. Leave the default value if you are not using a self-hosted Axiom instance.">
            <h6>Axiom Host</h6>
          </Label>
          <InlineField label="URL" labelWidth={12}>
            <Input
              onChange={onHostChange}
              value={jsonData.apiHost || 'https://api.axiom.co'}
              placeholder="axiom host"
              width={40}
            />
          </InlineField>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export function isValid(settings: AxiomDataSourceOptions): boolean {
  if (!settings) {
    return false;
  }

  const { apiHost } = settings;
  if (!apiHost) {
    return false;
  }

  return true;
}
