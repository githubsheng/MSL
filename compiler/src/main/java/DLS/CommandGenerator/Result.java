package DLS.CommandGenerator;

import java.util.List;

/**
 * Created by wangsheng on 9/10/17.
 */
public class Result {

    public final List<String> stringConstants;
    public final List<String> commands;

    public Result(List<String> strings, List<String> commands) {
        this.stringConstants = strings;
        this.commands = commands;
    }
}
