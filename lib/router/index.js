import asLink from './as_link.js';
import { ListItem as RTListItem } from 'react-toolbox/lib/list';
import { Link as RTLink } from 'react-toolbox/lib/link';

export var Link = asLink(RTLink);
export var ListItem = asLink(RTListItem);