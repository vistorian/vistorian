import { GraphgraView } from 'netpanorama';
import { Json } from 'ivy-language';
import { TemplateMap } from 'ivy-language';

export declare const render: (template: string | Json, paramsToSubstitute: TemplateMap, containerId: string, options: object, patch: object, state?: any) => Promise<GraphgraView | undefined>;

export { }
