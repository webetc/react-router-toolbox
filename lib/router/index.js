import asLink from './as_link.js';
import { ListItem } from 'react-toolbox/lib/list';
import { Link } from 'react-toolbox/lib/link';
import { Button, IconButton } from 'react-toolbox/lib/button';

export var SimpleLink = asLink(Link);
export var ListItemLink = asLink(ListItem);
export var ButtonLink = asLink(Button);
export var IconButtonLink = asLink(IconButton);