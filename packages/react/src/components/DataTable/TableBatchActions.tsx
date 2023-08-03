/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { type MouseEventHandler } from 'react';
import Button from '../Button';
import TableActionList from './TableActionList';
import { Text } from '../Text';
import { usePrefix } from '../../internal/usePrefix';
import type { InternationalProps } from '../../types/common';

const TableBatchActionsTranslationKeys = [
  'carbon.table.batch.cancel',
  'carbon.table.batch.items.selected',
  'carbon.table.batch.item.selected',
] as const;

export type TableBatchActionsTranslationKey =
  (typeof TableBatchActionsTranslationKeys)[number];

export interface TableBatchActionsTranslationArgs {
  totalSelected?: number;
}

export interface TableBatchActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    InternationalProps<
      TableBatchActionsTranslationKey,
      TableBatchActionsTranslationArgs
    > {
  /**
   * Provide elements to be rendered inside of the component.
   */
  children?: React.ReactNode;

  /**
   * Hook required to listen for when the user initiates a cancel request
   * through this component.
   */
  onCancel: MouseEventHandler<HTMLButtonElement>;

  /**
   * Boolean specifier for whether or not the batch action bar should be
   * displayed.
   */
  shouldShowBatchActions?: boolean;

  /**
   * Numeric representation of the total number of items selected in a table.
   * This number is used to derive the selection message.
   */
  totalSelected: number;
}

export interface TableBatchActionsComponent
  extends React.FC<TableBatchActionsProps> {
  translationKeys: ReadonlyArray<TableBatchActionsTranslationKey>;
}

const translationKeys: Readonly<
  Record<TableBatchActionsTranslationKey, string>
> = {
  'carbon.table.batch.cancel': 'Cancel',
  'carbon.table.batch.items.selected': 'items selected',
  'carbon.table.batch.item.selected': 'item selected',
};

const translateWithId: TableBatchActionsProps['translateWithId'] = (
  id,
  { totalSelected } = { totalSelected: 0 }
) => {
  if (id === 'carbon.table.batch.cancel') {
    return translationKeys[id];
  }
  return `${totalSelected} ${translationKeys[id]}`;
};

const TableBatchActions: TableBatchActionsComponent = ({
  className,
  children,
  shouldShowBatchActions,
  totalSelected,
  onCancel,
  translateWithId: t = translateWithId,
  ...rest
}) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const prefix = usePrefix();
  const batchActionsClasses = cx(
    {
      [`${prefix}--batch-actions`]: true,
      [`${prefix}--batch-actions--active`]: shouldShowBatchActions,
    },
    className
  );

  const batchSummaryClasses = cx(`${prefix}--batch-summary`, {
    [`${prefix}--batch-summary__scroll`]: isScrolling,
  });

  return (
    <div
      onScroll={() => {
        setIsScrolling(!isScrolling);
      }}
      aria-hidden={!shouldShowBatchActions}
      className={batchActionsClasses}
      {...rest}>
      <div className={batchSummaryClasses}>
        <p className={`${prefix}--batch-summary__para`}>
          <Text as="span">
            {totalSelected > 1 || totalSelected === 0
              ? t('carbon.table.batch.items.selected', { totalSelected })
              : t('carbon.table.batch.item.selected', { totalSelected })}
          </Text>
        </p>
      </div>
      <TableActionList>
        {children}
        <Button
          className={`${prefix}--batch-summary__cancel`}
          tabIndex={shouldShowBatchActions ? 0 : -1}
          onClick={onCancel}>
          {t('carbon.table.batch.cancel')}
        </Button>
      </TableActionList>
    </div>
  );
};

TableBatchActions.translationKeys = TableBatchActionsTranslationKeys;

TableBatchActions.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,

  /**
   * Hook required to listen for when the user initiates a cancel request
   * through this component
   */
  onCancel: PropTypes.func.isRequired,

  /**
   * Boolean specifier for whether or not the batch action bar should be
   * displayed
   */
  shouldShowBatchActions: PropTypes.bool,

  /**
   * Numeric representation of the total number of items selected in a table.
   * This number is used to derive the selection message
   */
  totalSelected: PropTypes.number.isRequired,

  /**
   * Supply a method to translate internal strings with your i18n tool of
   * choice. Translation keys are available on the `translationKeys` field for
   * this component.
   */
  translateWithId: PropTypes.func,
};

TableBatchActions.defaultProps = {
  translateWithId,
};

export default TableBatchActions;
