package DLS.CommandGenerator.commands.flow;

import DLS.CommandGenerator.Command;

/**
 * Created by sheng.wang on 2017/10/04.
 */
public interface CompareAndBranch extends Command {

    void setBranch(Command command);

}
