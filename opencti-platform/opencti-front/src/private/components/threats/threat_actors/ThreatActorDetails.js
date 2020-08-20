import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose, join, map } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import Markdown from 'react-markdown';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import inject18n from '../../../../components/i18n';
import StixDomainObjectLabels from '../../common/stix_domain_objects/StixDomainObjectLabels';
import ItemCreator from '../../../../components/ItemCreator';

const styles = () => ({
  paper: {
    height: '100%',
    minHeight: '100%',
    margin: '10px 0 0 0',
    padding: '15px',
    borderRadius: 6,
  },
});

class ThreatActorDetailsComponent extends Component {
  render() {
    const { t, classes, threatActor } = this.props;
    const secondaryMotivations = threatActor.secondary_motivations
      ? map(
        (secondaryMotivation) => t(`motivation_${secondaryMotivation}`),
        threatActor.secondary_motivations,
      )
      : [t('motivation_unknown')];
    return (
      <div style={{ height: '100%' }}>
        <Typography variant="h4" gutterBottom={true}>
          {t('Details')}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <StixDomainObjectLabels
            labels={threatActor.objectLabel}
            id={threatActor.id}
          />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Creator')}
          </Typography>
          <ItemCreator creator={threatActor.creator} />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Sophistication')}
          </Typography>
          {t(
            `${
              threatActor.sophistication
                ? `sophistication_${threatActor.sophistication}`
                : 'sophistication_unkown'
            }`,
          )}
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Resource level')}
          </Typography>
          {t(
            `${
              threatActor.resource_level
                ? `resource_${threatActor.resource_level}`
                : 'resource_unkown'
            }`,
          )}
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Primary motivation')}
          </Typography>
          {t(
            `${
              threatActor.primary_motivation
                ? `motivation_${threatActor.primary_motivation}`
                : 'motivation_unpredictable'
            }`,
          )}
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Secondary motivations')}
          </Typography>
          <Markdown
            className="markdown"
            source={`+ ${join('\n\n+ ', secondaryMotivations)}`}
          />
          <Typography
            variant="h3"
            gutterBottom={true}
            style={{ marginTop: 20 }}
          >
            {t('Goals')}
          </Typography>
          <Markdown
            className="markdown"
            source={`+ ${join(
              '\n\n+ ',
              threatActor.goals ? threatActor.goals : [t('Unknown')],
            )}`}
          />
        </Paper>
      </div>
    );
  }
}

ThreatActorDetailsComponent.propTypes = {
  threatActor: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
};

const ThreatActorDetails = createFragmentContainer(
  ThreatActorDetailsComponent,
  {
    threatActor: graphql`
      fragment ThreatActorDetails_threatActor on ThreatActor {
        id
        sophistication
        resource_level
        primary_motivation
        secondary_motivations
        goals
        creator {
          id
          name
        }
        objectLabel {
          edges {
            node {
              id
              value
              color
            }
          }
        }
      }
    `,
  },
);

export default compose(inject18n, withStyles(styles))(ThreatActorDetails);
